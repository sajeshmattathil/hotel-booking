const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../Front end/public/himages'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const maxSize = 2 * 1024 * 1024; //2 MB
  
const upload = multer({ 
  storage: storage ,
  limits: { fileSize: maxSize ,
            files:3
          }
});

module.exports = upload

