var express = require('express');
var router = express.Router();
var passport = require('passport');


router.route('/')
    .get(( req, res, next ) => {
        if ( req.query.callback ) {
            req.session.callback = req.query.callback;
        }

        next();
    }, passport.authenticate( 'google' ,{ scope: [
            'https://mail.google.com',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/plus.login'
            ]
    } ));

router.route('/callback')
    .get(passport.authenticate('google',{successRedirect:'/users',failureRedirect:'/login'}),
        (req, res)=>{
            res.send(req);
        });

module.exports = router;