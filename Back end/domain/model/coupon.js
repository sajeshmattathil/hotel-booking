const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    
    name: {
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
    }
})

const coupon= new mongoose.model("coupon",couponSchema)
module.exports=coupon