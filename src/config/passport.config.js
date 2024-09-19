import passport from "passport";
import local from "passport-local";
import userService from "../models/user.js";
import { createHash, isValidPassword } from "../utils.js";
import jwt from 'passport-jwt';
import cookieParser from "cookie-parser";
import { secretOrKey } from "../utils.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;

const cookieExtractor = (req) => {
    let token = null;
    console.log(req.cookies)
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body;
        try {
            let user = await userService.findOne({ email: username });
            if (user) {
                console.log('User already exists');

                return done(null, false, { message: 'User already exists' });
            }

            const newUser = new userService({ first_name, last_name, email, age, password: createHash(password), cartId: false, role });
            let result = await userService.create(newUser);

            return done(null, result);



        } catch (err) {
            return done(err, { message: 'Error al registrar usuario' });
        }
    }))


    passport.use('login', new LocalStrategy({
        usernameField: 'email',

    }, async (username, password, done) => {
        try {
            const user = await userService.findOne({ email: username });
            if (!user) {
                console.log('User not found');

                return done(null, false, { message: 'User not found' });
            }
            if (!isValidPassword(user, password)) {
                console.log('Invalid password');

                return done(null, false, { message: 'Invalid password' });
            }



            return done(null, user);
        } catch (err) {
            return done(err, { message: 'Error al iniciar sesión' });
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: secretOrKey
    }, async (jwt_payload, done) => {
        try {
            if (!jwt_payload) {
                console.log('No token found');
                return done(null, false, { message: 'No token found' });
            }


            return done(null, jwt_payload, { message: 'Invalid Token' });



        } catch (error) {
            return done(error, { message: 'Error al iniciar sesión' });
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id);
        done(null, user);
    });
};

export default initializePassport;