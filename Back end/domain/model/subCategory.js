const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
 
  roomType: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  maxOccupancy: {
    type: Number,
    required: true,
  },
  amenities: [String],
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
