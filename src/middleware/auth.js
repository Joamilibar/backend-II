import passport from 'passport';
import { secretOrKey } from '../utils.js';
import jwt from 'jsonwebtoken';


export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/profile');
    }
};

/* export const isAdmin = (req, res, next) => {
    if (req.session.user.role === 'admin') {
        return next();
    } else {
        res.redirect('/profile');
    }
}; */


export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ error: 'No authenticated' });
    }
    const token = authHeader.split(' ')[1];
    console.log("Este es el token: ", token)

    jwt.verify(token, secretOrKey, (error, credencials) => {

        if (error) {
            return res.status(403).send({ error: 'Invalid Token' });
        }

        req.user = credencials;
        console.log('Credenciales: ', req.user)
        next();
    })
};