const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
      callback(null, true);
    } else {
      callback(new Error('Only images are allowed'));
    }
  }
}).single('image');

const resizeAndCompressImage = async (req, res, next) => {
  if (!req.file) {
    return next(new Error('No file uploaded'));
  }
  
  try {
    req.file.buffer = await sharp(req.file.buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 90 })
      .toBuffer();
    
    next();
  } catch (error) {
    console.error('Error resizing and compressing image:', error);
    next(error);
  }
};

module.exports = { upload, resizeAndCompressImage };

// const multer = require('multer');

// const MIME_TYPES = {
//   'image/jpg': 'jpg',
//   'image/jpeg': 'jpg',
//   'image/png': 'png'
// };

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'images');
//   },
//   filename: (req, file, callback) => {
//     const name = file.originalname.split(' ').join('_');
//     const extension = MIME_TYPES[file.mimetype];
//     callback(null, name + Date.now() + '.' + extension);
//   }
// });

// module.exports = multer({storage: storage}).single('image');