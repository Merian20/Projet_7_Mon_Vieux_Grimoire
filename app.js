const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Routes = require('./roots/roots.js');
const userRoutes = require('./roots/user.js');
const path = require('path');
const app = express();

mongoose.connect('mongodb+srv://user20102003:c172qt7jRN9ZuLyH@cluster.khahzz4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
  
  
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/roots', Routes);
app.use('/api/auth', userRoutes);
app.use('/api/books', Routes);
app.use('/api/bestrating', Routes);

module.exports = app;