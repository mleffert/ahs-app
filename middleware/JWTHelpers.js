const jwt = require('jsonwebtoken');
const error = require('http-errors');
const _ = require('lodash');

module.exports.jwt = function (req, res, next) {
    const token = (
        req.body && req.body.authorization) ||
        (req.query && req.query.authorization)
        || req.headers.authorization;

    if (token) {
        // console.log(token);
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.redirect(`${process.env.CLIENTURL}/Login`)
                // const thiserr = error(403, err.message);
                // next(thiserr);
                return;
            }
            // if everything is good, save to request for use in other routes
            res.locals.token = decoded;
            // console.log("Token is valid: " + token);
            next();
        });
    } else {
        res.redirect(`${process.env.CLIENTURL}/Login`)
        //
        // const thiserr = error(400, 'Missing Authorization Header');
        // next(thiserr);
    }
};