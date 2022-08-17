//Import du package bcrypt 
const bcrypt = require('bcrypt');

//Import du package jsonwebtoken
const jwt = require('jsonwebtoken');

//Import du modele User pour utilisation
const User = require('../models/User');

//Mise en place de la fonction signup pour enregistrer les nouveaux utilsateurs
exports.signup = (req, res, next) => {
    //hachage du mot de passe avec bcrypt
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//Mise en place de la fonction login permettant aux utilisateurs de se connecter
exports.login = (req, res, next) => {
    //Verification si l'utilisateur existe déjà et si le mot de passe correspond
    User.findOne({ email: req.body.email})
    .then(user => {
        if (user === null) {
            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrect'});    
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({ message: 'Paire identifiant/mot de passe incorrect'}); 
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, 
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h'}
                        )
                    });
                }
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }));
};