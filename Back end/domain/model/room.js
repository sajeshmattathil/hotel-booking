const mongoose=require('mongoose')
const{_id}=require('./newHotel')

const roomSchema=new mongoose.Schema({
   hotel_id:_id,
   
    roomType:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    roomCount:{
        type:Number,
        required:true
    }

})

const Room=new mongoose.model("Room",roomSchema)
module.exports=Room