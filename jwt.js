const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req,res,next)=>{

    //first check if the request header has auth or not
    const authorization= req.headers.authorization
    if(!authorization) return res.status(401).json({error: 'token not found'});

    //extract the jwt token from the request headers
    const token= req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: 'unauthorized'});

    try{
        //varify the jqt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //attach user info the the request
        req.user =decoded
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({error:'ivalid token'});

    }
}


//generate token
const generateToken=(userData)=>{
    //creating new jewt token using userdata
    return jwt.sign(userData, process.env.JWT_SECRET,{expiresIn: 3000});
        
}


module.exports ={jwtAuthMiddleware, generateToken};