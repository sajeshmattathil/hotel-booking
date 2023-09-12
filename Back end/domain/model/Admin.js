const mongoose=require('mongoose')

const adminSchema=new mongoose.Schema({
   
    email:{
        type:String,
        required:true
    },
  
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:true
    }
        
})

const Admin=new mongoose.model("admin",adminSchema,'admin')
module.exports=Admin