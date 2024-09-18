import { Router } from 'express';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

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

export default router;