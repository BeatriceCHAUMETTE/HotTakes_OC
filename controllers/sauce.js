//Import du modele de données Sauce pour utilisation
const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');

//Implémentation des middlewares correspondants aux routes CRUD pour la gestion des sauces
//Création et enregistrement des sauces 
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error => res.status(400).json({ error }));
};

//Gestion des likes et dislikes des sauces
exports.likeSauce = (req, res) => {
    //Si l'user like = 1 alors l'user aime (= like) la sauce
    if(req.body.like === 1) {
        //Recherche de la sauce
        Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //Ajout de l'id de l'user avec push au tableau des likes
            sauce.usersLiked.push(req.body.userId);
            //Mise à jour des likes
            Sauce.updateOne({ _id: req.params.id }, { likes: sauce.likes+1, usersLiked: sauce.usersLiked })
            .then(() => res.status(200).json({ message: 'Like ajouté !' }))    
            .catch(error => res.status(400).json({ error }));
        });
    //Si l'user like = -1 alors l'user n'aime pas (= dislike) la sauce
    } else if (req.body.like === -1) {
        //Recherche de la sauce
        Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //Ajout de l'id de l'user avec push au tableau des dislikes 
            sauce.usersDisliked.push(req.body.userId);
            //Mise à jour des dislikes
            Sauce.updateOne({ _id: req.params.id }, { dislikes: sauce.dislikes+1, usersDisliked: sauce.usersDisliked })
            .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))    
            .catch(error => res.status(400).json({ error }));
        });
    //Sinon l'user like = 0 alors l'user annule son like ou son dislike
    } else {
        //Recherche de la sauce
        Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //Recherche avec includes si le tableau des usersLiked contient le userId de l'user
            if(sauce.usersLiked.includes(req.body.userId)) {
                //Retrait de l'id de l'user avec pop au tableau des likes 
                sauce.usersLiked.pop(req.body.userId);
                //Mise à jour des likes
                Sauce.updateOne({ _id: req.params.id }, { likes: sauce.likes-1, usersLiked: sauce.usersLiked })
                .then(() => res.status(200).json({ message: 'Like retiré !' }))    
                .catch(error => res.status(400).json({ error }));
            //Aussi recherche avec includes si le tableau des usersDisliked contient le userId de l'user
            } else if (sauce.usersDisliked.includes(req.body.userId)) {
                //Retrait de l'id de l'user avec pop au tableau des dislikes 
                sauce.usersDisliked.pop(req.body.userId);
                //Mise à jour des dislikes
                Sauce.updateOne({ _id: req.params.id }, { dislikes: sauce.dislikes-1, usersDisliked: sauce.usersDisliked}) 
                .then(() => res.status(200).json({ message: 'Dislike retiré !' }))    
                .catch(error => res.status(400).json({ error }));
            };   
        })
        .catch(error => res.status(400).json({ error }));   
    };
};

//Récupération d'une seule sauce
exports.getOneSauce = (req, res) => {
    console.log(req.auth.userId);
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

//Modification d'une sauce
exports.modifySauce = (req, res) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : { ...req.body };
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({ message: 'Non autorisé !'});
        } else {
            if(req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch(error => res.status(400).json({ error }));
                });           
            } else { 
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                .catch(error => res.status(400).json({ error }));
            }           
        }
    })
    .catch(error => res.status(400).json({ error }));   
};    
    
//Suppression d'une sauce
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({ message: 'Non autorisé !' });
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                .catch(error => res.status(400).json({ error }));
            });           
        }
    })
    .catch(error => res.status(400).json({ error }));
};

//Récupération de toutes les sauces
exports.getAllSauce = (req, res) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


