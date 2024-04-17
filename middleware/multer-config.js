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
    return next();
  }

  try {
    req.file.buffer = await sharp(req.file.buffer)
      .resize({ width: 800 }) // Redimensionner l'image à une largeur maximale de 800 pixels
      .jpeg({ quality: 90 }) // Compresser l'image au format JPEG avec une qualité de 90%
      .toBuffer();

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, resizeAndCompressImage };
