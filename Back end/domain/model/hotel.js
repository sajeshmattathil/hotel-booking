const mongoose=require('mongoose')

const hotelSchema=new mongoose.Schema({
    owner_id:{
        type:String,
        required:false
    },
    star_rating:{
        type:Number,
        require:true
    },
    
    hotel_name:{
        type:String,
        required:true
    },
    star_rating:{
        type:Array,
        required:true
    },
    description:{
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
    cancellationPolicy:{
        type:String,
        required:false
    },
    imagesOfHotel:{
        type:Array,
        required:true
    }
    ,
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner'
    
      }, 
      amenities:{
        type:Array,
        required:true
      },
    isActive:{
        type:Boolean,
        default:true
    },
    isApproved:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:'inactive'
      }

})

const Hotel=new mongoose.model("Hotel",hotelSchema)
module.exports=Hotel