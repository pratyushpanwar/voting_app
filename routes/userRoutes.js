const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken}= require('./../jwt');

//POST route to add person
router.post('/signup', async (req,res)=>{
    try{
      const data =req.body
  
    // creat a new user data
    const newUser = new User(data);
  
    // save the new person data
    const response = await newUser.save();
    console.log('data saved',JSON.stringify(response));

    const payload= {
      id: response.id,
    };
    console.log(JSON.stringify(payload));
    const token=generateToken(payload);
    console.log('Token is :',token);

    res.status(200).json({response :response, token :token});
    
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  
  }
   })

//login user
   router.post('/login', async (req,res)=>{
    try{
      //extract pass from and uername form request
      const{aadharCardNumber,password}=req.body;

      //find by username
      const user= await User.findOne({aadharCardNumber:aadharCardNumber});
      
      //if user does not exist
      if(!user || !(await user.comparePassword(password))){
        return res.status(401).json({errror: 'invalid username or password'});

      }

      //generate tokens
      const payload ={
        id: user.id,
      }
      const token = generateToken(payload);

      //return token as response
      res.json({token:token})

    }catch(err){
      console.error(err);
      res.status(500).json({error:'internal server error'});
    }

    });

    //profile route
    router.get('/profile',jwtAuthMiddleware, async (req,res)=>{
      try{
        const userData= req.user;
        
      
        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({user});
      }catch(err){
        console.error(err);
        res.status(500).json({error:'internal server error'});
      }
    });


router.put('/profile/password',jwtAuthMiddleware, async(req,res)=>{
  try{
    const userId= req.user.id;//extracting id from token
    
    const updatedPersonData= req.body;//updated data for person
    const {currentPassword,newPassword}= req.body;

    //find by userId
    const user= await User.findById(userId);
    
    //if pass does not match, return err
    if(!(await user.comparePassword(currentPassword))){
        return res.status(401).json({error: 'invalid username or password'});
    }
    
    //update the password
    user.password=newPassword;
    await user.save();

    console.log('password updated');
    res.status(200).json({message:'password updated'});
  }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'});
  }
})


  module.exports = router;

