const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
   transaction_id : {
    type:mongoose.Schema.Types.ObjectId,

   },
   amount:{
    type:Number,
    required:true
   },
   transaction_type:{
    type:String,
    reuired:true
   },
   date:Date

})

const wallet = mongoose.model('wallet',walletSchema)

module.exports = wallet