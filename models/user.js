
const mongoose=require('mongoose');
const bcrypt = require('bcrypt');

//define User schema

const userSchema= new mongoose.Schema({
    name :{
        type : String,
        required : true,
    },
    age: {
        type: Number,
        required:true
    },
    email: {
        type:String
    },
    mobile: {
        type:String
    },
    address: {
        type:String,
        required:true
    },
    aadharCardNumber: {
        type: Number,
        required: true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    role: {
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted: {
        type:Boolean,
        default:false
    }

});


userSchema.pre('save', async function(next){
    const person=this;
   
    //hashing pass if modified
    if(!person.isModified('password'))return next();
   
    try{
       //hashing pass generation
       const salt = await bcrypt.genSalt(10);
       
       //hash pass
       const hashedPassword = await bcrypt.hash(person.password,salt);
     
       person.password=hashedPassword;
   
       next();
    }catch(err){
        next(err);
    }
   })
   
   userSchema.methods.comparePassword= async function(candidatePassword){
       try{
       const     isMatch= await bcrypt.compare(candidatePassword,this.password);
       return isMatch;
           }catch(err){
           throw err;
       }
   };
// create person model
const User =mongoose.model('User',userSchema);
module.exports=User;