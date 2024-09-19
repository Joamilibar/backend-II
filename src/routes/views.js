import { Router } from 'express';
import { authToken, isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
    const roles = [
        { value: 'user', label: 'Usuario' },
        { value: 'admin', label: 'Administrador' }
    ];
    return res.render('register', { roles });
});

router.get('/profile', isAuthenticated, (req, res) => {

    res.render('profile', { user: req.session.user });
});

router.get('/update', isNotAuthenticated, (req, res) => {
    res.render('update');
});

router.get('/current', isAuthenticated, (req, res) => {
    const user = req.session.user;
    console.log('Usuario Registrado: ', user);
    return res.render('current', { user });

}
);

export default router;