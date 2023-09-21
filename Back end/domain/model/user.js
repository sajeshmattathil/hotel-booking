const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
     mobile:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        default:"Select your gender"
    },
    addressDetails: {
        address: String,
        city: String,
        pin: String
      },
    password:{
        type:String,
        required:true
    },
    isUser:{
        type:Boolean,
        default:true
    }
        
})

const User=new mongoose.model("User",userSchema)
module.exports=User