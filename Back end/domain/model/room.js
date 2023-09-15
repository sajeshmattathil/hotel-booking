const mongoose=require('mongoose')
const{_id}=require('./newHotel')

const roomSchema=new mongoose.Schema({
   
   
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
    },
    amnities:{
        type:Array,
        default:[]
    },
    availableRooms:{
        type:Number,
        required:true
    },
    imagesOfRoom:{
        type:Array,
        required:true
    },
    isAvailable:{
        type:Boolean,
        required:true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
      }

})

const Room=new mongoose.model("Room",roomSchema)
module.exports=Room