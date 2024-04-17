// const express = require ('express');
// const router = express.Router();
// const { upload, resizeAndCompressImage } = require('./../middleware/multer-config');
// const auth = require ('./../middleware/auth');
// const multer = require ('./../middleware/multer-config');
// const booksCtrl = require('./../controllers/roots');

// router.post('/:id/rating', auth, booksCtrl.rateBook);
// router.post('/', auth, upload, resizeAndCompressImage, booksCtrl.createBookSchema);
// router.put('/:id', auth, upload, booksCtrl.modifyBookSchema);
// router.delete('/:id', auth, booksCtrl.deleteBookSchema);
// router.get('/:id', multer, booksCtrl.getOneBookSchema);
// router.get('/', booksCtrl.getAllBooksSchema);
// router.get('/bestrating', booksCtrl.getBestRatedBooks);

// module.exports = router;

const express = require('express');
const router = express.Router();
const multerConfig = require('./../middleware/multer-config'); // Import unique de multer-config
const auth = require('./../middleware/auth');
const booksCtrl = require('./../controllers/roots');

router.post('/:id/rating', auth, booksCtrl.rateBook);
router.post('/', auth, multerConfig.upload, multerConfig.resizeAndCompressImage, booksCtrl.createBookSchema);
router.put('/:id', auth, multerConfig.upload, booksCtrl.modifyBookSchema);
router.delete('/:id', auth, booksCtrl.deleteBookSchema);
router.get('/:id', multerConfig.upload, booksCtrl.getOneBookSchema);
router.get('/', booksCtrl.getAllBooksSchema);
router.get('/bestrating', booksCtrl.getBestRatedBooks);

module.exports = router;