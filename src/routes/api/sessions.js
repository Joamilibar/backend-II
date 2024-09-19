import { Router } from 'express';
import User from '../../models/user.js';
import { authorization, createHash, isValidPassword, passportCall, createToken } from '../../utils.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';




const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    const { email, password } = req.body;

    let token = createToken(req.user);

    console.log(({ status: "success", message: "Usuario registrado correctamente" }))
    res.set('Authorization', `Bearer ${token}`);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/login');



    /* const { first_name, last_name, email, age, password } = req.body;
    try {
        const newUser = new User({ first_name, last_name, email, age, password: createHash(password) });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error al registrar usuario');
    } */
});

router.get('/failregister', (req, res) => {
    console.log('Estrategia Fallida')
    res.status(400).send({ status: "error", error: "Usuario ya existe" })
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
    // const { email, password } = req.body;

    if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales Invalidas" })



    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        cartId: req.user.cartId,
        role: req.user.role
    };

    /*  if (req.user.role === 'admin') {
        return res.redirect('/admin');
        
        } */

    let token = createToken(req.user);
    console.log(token)
    res.set('Authorization', `Bearer ${token}`);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/profile');

});

router.get('/faillogin', (req, res) => {
    console.log('Login Fallida')
    res.status(400).send({ status: "error", error: "Credenciales Invalidas" })
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

router.post('/update', async (req, res) => { // ACTUALIZAR PASSWORD DE UN USUARIO
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).send({ status: "error", error: "Valores incompletos" })

        const user = await User.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, cartId: 1, role: 1 });
        console.log(user)

        if (!user) return res.status(400).send({ status: "error", error: "Usuario no encontrado" });

        await User.updateOne({ email }, { password: createHash(password) });
        res.redirect('/login');

    } catch (error) {
        console.error(error)
    }

});

router.get('/current', passportCall('jwt'), authorization('user'), (req, res) => {
    res.send(req.user);
});

export default router;
