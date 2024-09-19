import { Router } from 'express';
import { authToken, isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

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
    let token = req.cookies.token;
    console.log('Token:', token, Boolean(token));
    if (!token) return res.status(401).send({ error: 'No authenticated, no token' });

    try {

        let decoded = jwt.verify(token, secretOrKey);
        console.log('Decoded:', decoded);
        res.render('profile', { user: decoded, sessionUser: req.session.user });
    }
    catch (err) {
        return res.status(403).send({ error: 'Invalid Token' });
    }
}
);

export default router;