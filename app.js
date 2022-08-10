// Import d'Express
const express = require('express');

// Import du package CORS
const cors = require('cors');

// Import du package Mongoose pour faciliter les interactions avec la base de données MongoDB
const mongoose = require('mongoose');

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

// Renvoi de la réponse dans l'app en json
app.use((req, res) => {
    res.json({message: 'Votre requête a été reçue'});
});

// Export de l'application express
module.exports = app;

