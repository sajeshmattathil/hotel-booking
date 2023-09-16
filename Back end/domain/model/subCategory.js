const mongoose = require('mongoose');


 
  const subCategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    status:{
      type:String,
      default:'active'
    }
  
  });
  

const subCategory = mongoose.model('subCategory', subCategorySchema);

module.exports = subCategory;
