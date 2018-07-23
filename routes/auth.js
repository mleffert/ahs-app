const express = require('express'),
 router = express.Router(),
 passport = require('passport'),
 request = require('../middleware/RequestWrapper'),
 jwt = require('jsonwebtoken');


router.route('/')
    .get(
        request.wrap(passport.authorize( 'google' ,{ scope: [
            'https://mail.google.com',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/classroom.courses.readonly',
            'https://www.googleapis.com/auth/classroom.rosters.readonly'
            ]
    } )));

router.route('/callback')
    .get(
        request.wrap(passport.authorize('google', { failureRedirect: '/login' })),
        request.wrap((req, res, next) => {
            let {id, isTeacher, firstName, lastName, email} = req.account;
            const token = jwt.sign({id, isTeacher, firstName, lastName, email}, process.env.SECRET, {expiresIn: '12h'});

            res.redirect(`${process.env.CLIENTURL}/login?token=${token}`);

        }));

module.exports = router;