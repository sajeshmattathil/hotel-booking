const mongoose=require('mongoose')

const ownerSchema=new mongoose.Schema({
    owner_name:{
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
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isOwner:{
        type:Boolean,
        default:true
    },
    wallet:{
        type:Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

const Owner=new mongoose.model("Owner",ownerSchema,'owner')
module.exports=Owner