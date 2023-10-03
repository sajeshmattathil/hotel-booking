const mongoose = require('mongoose');

const currentBookingsSchema = new mongoose.Schema({
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

  }


});
  

const bookings = mongoose.model('bookings', currentBookingsSchema);

module.exports = bookings;
            