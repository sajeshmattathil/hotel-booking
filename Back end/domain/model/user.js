const mongoose=require('mongoose')

const referalSchema = new mongoose.Schema({
    referalCode:{
        type:String,
        required:false
    },
    referalMoney:{
        type:Number,
        required:false
    }
})

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
    },
    wallet:{
        type:Number,
        default:100
    },
    referal:referalSchema
        
})

const User=new mongoose.model("User",userSchema)
module.exports=User