// Création du router avec la méthode router d'express
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')


// Import du controller sauce
const sauceCtrl = require('../controllers/sauce')

// Enregistrement de la route POST dans le router pour enregistrer la sauce
router.post('/', auth, multer, sauceCtrl.createSauce);  

// Enregistrement de la route GET dans le router pour récupérer une seule sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);

// Enregistrement de la route PUT dans le router pour modifier une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Enregistrement de la route DELETE dans le router pour supprimer une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Enregistrement de la route GET dans le router pour récupérer toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauce);

//Exportation du router
module.exports = router;
