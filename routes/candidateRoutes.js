const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {jwtAuthMiddleware, generateToken}= require('../jwt');
const Candidate = require('../models/candidate');


const checkAdminRole = async(userID)=>{
  try{
    const user = await User.findById(userID);
    if(user.role==='admin'){
      return true;
    }

  }catch(err){
    return false;
  }
}



//POST route to add candidate
router.post('/',jwtAuthMiddleware, async (req,res)=>{
    try{if(!await checkAdminRole(req.user.id))
      return res.status(404).json({message:'user has no admin role'});
    

      const data =req.body
  
    // creat a new user data
    const newCandidate = new Candidate(data);
  
    // save the new person data
    const response = await newCandidate.save();
    console.log('data saved',JSON.stringify(response));
    res.status(200).json({response :response});
    
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  
  }
   })




   router.put('/:candidateID',jwtAuthMiddleware, async(req,res)=>{
    try{
      if(! await checkAdminRole(req.user.id))
      return res.status(403).json({message:'user has no admin role'});
      
      const candidateID= req.params.candidateID;//extracting id from URL
    const updatedCandidateData= req.body;//updated data for person

    const response= await Candidate.findByIdAndUpdate(candidateID,updatedCandidateData,{
      new: true,
      runValidators:true,
    })
    if(!response){
      return res.status(404).json({error: 'candidate not found'});

    }

    console.log('candidate data updated');
    res.status(200).json(response);
    }catch(err){
      console.log(err);
      res.status(500).json({error:'internal server error'});
    }
  })



  router.delete('/:candidateID',jwtAuthMiddleware, async(req,res)=>{
    try{
      if(! await checkAdminRole(req.user.id))
      return res.status(403).json({message:'user has no admin role'});
      
      const candidateID= req.params.candidateID;//extracting id from URL
    const response= await Candidate.findByIdAndDelete(candidateID)
    if(!response){
      return res.status(404).json({error: 'candidate not found'});

    }

    console.log('candidate deleted');
    res.status(200).json(response);
    }catch(err){
      console.log(err);
      res.status(500).json({error:'internal server error'});
    }
  })

  //start votin
  router.post('/vote/:candidateID',jwtAuthMiddleware, async(req,res)=>{
    candidateID = req.params.candidateID;
      userID = req.user.id;
    
    try{
      const candidate= await Candidate.findById(candidateID);
      if(!candidate){
        return res.status(404).json({message: 'candidate not found'});
      } 

      const user= await User.findById(userID);
      if(!user){
        return res.status(404).json({message: 'candidate not found'});
      }
        if(user.isVoted){
          return res.status(400).json({message:"you have already voted"});
        }
        if(user.role=='admin'){
          return res.status(403).json({message:'admin is not allowed to vote'});
        }

        //update candidate data
        candidate.votes.push({user: userID})
        candidate.voteCount++;
        await candidate.save();

        //updating user docs
        user.isVoted=true
        await user.save();

        return res.status(200).json({message:'Vote recorded Successfully'});


    }catch(err){
      console.log(err);
      res.status(500).json({message:'internal server error'});

    }
  });

  //vote count
  router.get('/vote/count', async(req,res)=>{
try{
  const candidate = await Candidate.find().sort({votecunt:'desc'});

  const voteRecord= candidate.map((data)=>{
    return{
      party: data.party,
      count: data.voteCount
    }
  });

  return res.status(200).json(voteRecord);

}catch(err){
      console.log(err);
      res.status(500).json({message:'internal server error'});

    }
  });

  //gitting list of candidates
  router.get('/',async (req,res)=>{
    try{
      const candidates =await Candidate.find({},'name party ');

        // Handle empty results
    if (!candidates || candidates.length === 0) {
      return res.status(200).json({ data: [], message: 'No candidates found' });
    }

      //return list of candidtes
       res.status(200).json(candidates);
    }catch(err){
      console.error(err);
       res.status(500).json({error:'internal server error'})
    }
  });

  module.exports = router;

