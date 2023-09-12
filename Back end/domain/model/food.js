const mongoose=require('mongoose')
const{_id}=require('./newHotel')

const foodSchema=new mongoose.Schema({
   hotel_id:_id,
   isAvailable:{
        type:Boolean,
        require:true
    },
    foodType:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }

})

const Food=new mongoose.model("Food",foodSchema)
module.exports=Food