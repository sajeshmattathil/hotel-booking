const mongoose = require('mongoose');

  const currentBookingsSchema = new mongoose.Schema({
   bookingsStatus:{
                type:Array,
                required:false

               }
  
  });
  

const bookings = mongoose.model('bookings', currentBookingsSchema);

module.exports = bookings;