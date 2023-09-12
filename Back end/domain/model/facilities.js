const mongoose=require('mongoose')
const{_id}=require('./newHotel')

const facilitiesSchema=new mongoose.Schema({
   hotel_id:_id,
   
    Type:{
        type:String,
        required:true
    }

})

const Facilities=new mongoose.model("Facilities",facilitiesSchema)
module.exports=Facilities