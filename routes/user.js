// Création du router avec la méthode router d'express
const express = require('express');
const router = express.Router();

// Configuration du router
const userCtrl = require('../controllers/user');

//Création des routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//Exportation du router
module.exports = router;