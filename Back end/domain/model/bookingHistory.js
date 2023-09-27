const mongoose = require('mongoose');

  const bookingsHistorySchema = new mongoose.Schema({
   bookingsStatus:{
                type:Array,
                required:false

               } 
  });
const history = mongoose.model('history', bookingsHistorySchema);

module.exports = history;