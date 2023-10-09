const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    startingDate: {
        type: Date,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    used_users:{
        type:Array,
        required:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    hotel_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hotels'
    }
})

const offer= new mongoose.model("offer",offerSchema)
module.exports=offer