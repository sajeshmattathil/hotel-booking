const mongoose=require('mongoose')
const{email}=require('./owner')

const hotelSchema=new mongoose.Schema({
    owner_id:{
        type:String,
        required:true
    },
    
    hotel_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
   
    city:{
        type:String,
        required:true
    },
    totalRoomsAvailable:{
        type:Number,
        required:true
    },
    nearTouristDestination:{
        type:String,
        required:true
    },
    imagesOfHotel:{
        type:Array,
        required:true
    }
    ,
    isActive:{
        type:Boolean,
        default:true
    },
    isApproved:{
        type:Boolean,
        default:false
    }

})

const Hotel=new mongoose.model("Hotel",hotelSchema)
module.exports=Hotel