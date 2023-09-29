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
    type: String,
    required: true

  },
  room_id: {
    type: String,
    required: true

  },
  checkin_date: {
    type: String,
    required: true

  },
  checkout_date: {
    type: String,
    required: true

  },
  status: {
    type: String,
    required: true

  }


});
  

const bookings = mongoose.model('bookings', currentBookingsSchema);

module.exports = bookings;
            