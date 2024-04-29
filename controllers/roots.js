const BooksSchema = require('./../models/books');
const Book = require ('./../models/books.js');
const fs = require('fs');

exports.createBookSchema = (req, res, next) => {
    const booksSchemaObject = JSON.parse(req.body.book);
    delete booksSchemaObject._id;
    delete booksSchemaObject._userId;
    const userId = req.auth.userId;
    //console.log('Chemin de l\'image :', `${req.protocol}://${req.get('host')}/images/${req.file.filename}`);
    const book = new Book({
        ...booksSchemaObject,
        userId: userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // console.log("req.protocol:", req.protocol);
    // console.log("req.get('host'):", req.get('host'));
    // console.log("req.file.filename:", req.file.filename);
    book.save()
        .then(() => res.status(201).json({
            message: 'Livre enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
}

exports.modifyBookSchema = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };

    delete bookObject._userId;
    BooksSchema.findOne({
            _id: req.params.id
        })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({
                    message: 'Not authorized'
                });
            } else {
                BooksSchema.updateOne({
                        _id: req.params.id
                    }, {
                        ...bookObject,
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Livre modifié!'
                    }))
                    .catch(error => res.status(401).json({
                        error
                    }));
            }
        })
        .catch((error) => {
            res.status(400).json({
                error
            });
        });
}

exports.deleteBookSchema = (req, res, next) => {
    BooksSchema.findOne({
            _id: req.params.id
        })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({
                    message: 'Not authorized'
                });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    BooksSchema.deleteOne({
                            _id: req.params.id
                        })
                        .then(() => {
                            res.status(200).json({
                                message: 'Livre supprimé !'
                            })
                        })
                        .catch(error => res.status(401).json({
                            error
                        }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error
            });
        });
};

exports.getOneBookSchema = (req, res, next) => {
    BooksSchema.findOne({
            _id: req.params.id
        })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({
            error
        }));
}

exports.getAllBooksSchema = (req, res, next) => {
    BooksSchema.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({
            error
        }));
}

exports.getBestRatedBooks = (req, res, next) => {
        console.log(getBestRatedBooks);
    BooksSchema.aggregate([
        {
            $project: {
                _id: 1,
                title: 1,
                averageRating: { $avg: "$ratings" }
            }
        },
        {
            $sort: { averageRating: -1 }
        },
        {
            $limit: 3
        }
    ])
    .then(bestRatedBooks => res.status(200).json(bestRatedBooks))
    .catch(error => res.status(500).json({ error }));
};

exports.rateBook = (req, res, next) => {
    const { userId, rating } = req.body;
    const bookId = req.params.id;

    if (rating < 0 || rating > 5) {
        return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5.' });
    }

    Book.findById(bookId)
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: 'Livre non trouvé.' });
            }

            const userRatingIndex = book.rating.findIndex(r => r.userId === userId);
            if (userRatingIndex !== -1) {
                return res.status(400).json({ error: "Vous avez déjà noté ce livre." });
            }

            book.rating.push({ userId, grade: rating });

            const totalRating = book.rating.reduce((acc, cur) => acc + cur.grade, 0);
            book.averageRating = totalRating / book.rating.length;

            book.save()
                .then(updatedBook => {
                    res.status(200).json(updatedBook);
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
