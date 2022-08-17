// Import d'Express
const express = require('express');

// Import du package CORS
const cors = require('cors');

// Import du package Mongoose pour faciliter les interactions avec la base de données MongoDB
const mongoose = require('mongoose');

// Import du modele sauce
const sauce = require('./models/Sauce');
const Sauce = require('./models/Sauce');

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

// Création de la route POST pour enregistrer la sauce
app.post('/api/sauces', (req, res) => {
    delete req.body._id;
    const sauce = new Sauce ({
        ...req.body
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
});

// Création de la route GET pour récupérer une seule sauce
app.get('/api/sauces/:id', (req, res) => {
    Sauce.findOne({ _id: req.params.id})
    .then(() => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
});

// Création de la route PUT pour modifier une sauce
app.put('/api/sauces/:id', (req, res) => {
    Sauce.updateOne({ _id: req.params.id}, { ...req, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
});

// Création de la route DELETE pour supprimer une sauce
app.delete('/api/sauces/:id', (req, res) => {
    Sauce.deleteOne({ _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
    .catch(error => res.status(400).json({ error }));
});

// Création de la route GET pour récupérer toutes les sauces
app.get('/api/sauces', (req, res) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
});

// Export de l'application express
module.exports = app;

