var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');
var GoogleStrategy   = require( 'passport-google-oauth' ).OAuth2Strategy;
var db = require('ahs-persistence');
var GoogleInfo = require('./helpers/GoogleHelpers').GoogleInfo;
var request = require('./middleware/RequestWrapper');
const edebug  = require( 'debug' )( 'apis:error' );

var app = express();
app.use(cors());

passport.use(new GoogleStrategy({
    clientID: process.env.ClientId,
    clientSecret: process.env.ClientSecret,
    callbackURL: "http://localhost:3000/auth/callback",
    passReqToCallback:true
},  async (request, accessToken, refreshToken, profile, done) => {
    var pers = await db.user.findAll();
    var person = await db.user.VerifyUserOrCreate(await new GoogleInfo(profile, accessToken).getEmail());
    if(person){
        return done(null, person);
    } else {
        return done();
    }
}))

app.use( passport.initialize() );
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



require('./routes')(app);


// Response Unifier and 404 handler
app.use((req, res, next) => {
    if (!res.isRoute) {
        next(error(404, 'Route Not Found'));
    }
    const data = res.locals;
    const ret = {
        status: res.statusCode,
        data
    };
    res.send(ret);
});


app.use( (err, req, res, next ) => {
    edebug({
        error: err.message,
        stack: err.stack.split( '\n' )
    });

    res.status( err.statusCode || 500 ).send({
        status: err.statusCode,
        error: err.message,
        stack: global.isProd ? undefined : err.stack.split( '\n' )
    });
});


module.exports = app;
