const express = require('express'),
 router = express.Router(),
 passport = require('passport'),
 request = require('../helpers/requestWrapper'),
 jwt = require('jsonwebtoken');


router.route('/')
    .get(
    //     ( req, res, next ) => {
    //     if ( req.query.callback ) {
    //         req.session.callback = req.query.callback;
    //     }
    //
    //     next();
    // },
        request.wrap(passport.authorize( 'google' ,{ scope: [
            'https://mail.google.com',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/plus.login'
            ]
    } )));

router.route('/callback')
    .get(
        request.wrap(passport.authorize('google', { failureRedirect: '/login' })),
        request.wrap((req, res, next) => {
            let {id, isTeacher, firstName, lastName, email} = req.account;
            const token = jwt.sign({id, isTeacher, firstName, lastName, email}, process.env.SECRET, {expiresIn: '12h'});

            res.redirect(`http://localhost:3001/login?token=${token}`);

        }));

module.exports = router;