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
    roomNumber:{
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
    breakfastPrice:{
        type:Number,
        required:false
    },
    review:{
        type:Array,
        required:false
    },
    customerRating:{
        type:Number,
        required:false
    },
    bookingDetails:{
        type:Array,
        required:false
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

const Room=new mongoose.model("Room",roomSchema,'rooms')
module.exports=Room