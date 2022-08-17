//Import du modele Sauce pour utilisation
const Sauce = require('../models/Sauce');

//Export de la fonction de création de sauce
exports.createSauce = (req, res) => {
    delete req.body._id;
    const sauce = new Sauce ({
        ...req.body
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

//Export de la fonction de récupération d'une seule sauce
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id})
    .then(() => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

//Export de la fonction de modification de sauce
exports.modifySauce = (req, res) => {
    Sauce.updateOne({ _id: req.params.id}, { ...req, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};


//Export de la fonction de suppression de sauce
exports.deleteSauce = (req, res) => {
    Sauce.deleteOne({ _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
    .catch(error => res.status(400).json({ error }));
};

//Export de la fonction de récupération de toutes les sauces
exports.getAllSauce = (req, res) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


