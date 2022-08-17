// Import d'Express
const express = require('express');

// Import du package Mongoose pour faciliter les interactions avec la base de données MongoDB
const mongoose = require('mongoose');

const path = require('path');

// Import du package CORS
const cors = require('cors');

// Import du router sauce
const sauceRoutes = require('./routes/sauce')

//Import du router utilisateur
const userRoutes = require('./routes/user');

// Création de l'application express
const app = express();

// Connexion à la base de données
mongoose.connect('mongodb+srv://BCWebmaster:OCprojet6BC0822@piquante.nu9ofkm.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Ajout middleware permettant d'analyser le corps des requêtes
app.use(express.json());

app.use(cors());

//Utilisation du routeur

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));


// Export de l'application express
module.exports = app;

