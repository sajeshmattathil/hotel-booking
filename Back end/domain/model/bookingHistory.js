const mongoose = require('mongoose');

const otherDetailsSchema= new mongoose.Schema({
  couponUsed: {
    type: String,
    required: false

  },
  paymentMode: {
    type: String,
    required: false

  },
  moneyFromWallet: {
    type: Number,
    required: false

  },
  moneyPaid:{
    type: Number,
    required: false
  }

})
const bookingsHistorySchema = new mongoose.Schema({
  userName: {
    type: String,
    required: false

  },
  name: {
    type: String,
    required: true

  },
  roomNumber: {
    type: String,
    required: false

  },
  email: {
    type: String,
    required: true

  },
  hotel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hotels'

  }, 
  room_id: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'rooms'

  },
  checkin_date: {
    type: Date,
    required: true

  },
  checkout_date: {
    type: Date,
    required: true

  },
  status: {
    type: String,
    required: true

  },
  otherDetails:otherDetailsSchema
  });
const history = mongoose.model('history', bookingsHistorySchema,'Bookinghistory');

module.exports = history;