const mongoose=require('mongoose')


const roomSchema=new mongoose.Schema({
   

    roomType:{
        type:String,
        required:true
    },
    roomSpace:{
        type:String,
        required:true
    },
    description:{
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
        required:true
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
        default:true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
      },
     

})

const Room=new mongoose.model("Room",roomSchema)
module.exports=Room