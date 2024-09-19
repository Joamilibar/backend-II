import passport from 'passport';

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

export const authToken = (req, res, next) => {
    passport.authenticate('jwt', { session: false });


}
/* export const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send({ error: 'No authenticated' });
    const token = authHeader.split(' ')[1];

    jwt.verify(token, PRIVATE_KEY, (err, user) => {
        if (err) return res.status(403).send({ error: 'Invalid Token' });
        req.user = credentials.user;
        next();
    })
}; */