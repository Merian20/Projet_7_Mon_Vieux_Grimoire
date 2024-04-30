const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

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
    const filePath = req.file.path;
    const outputFilePath = path.join('images', 'modified_' + req.file.filename);

    await sharp(filePath)
      .resize({
        width: 800
      })
      .jpeg({
        quality: 90
      })
      .toFile(outputFilePath);

    req.savedFilePath = outputFilePath;
    next();
  } catch (error) {
    console.error('Error resizing and compressing image:', error);
    next(error);
  }
};

module.exports = {
  upload,
  resizeAndCompressImage
};