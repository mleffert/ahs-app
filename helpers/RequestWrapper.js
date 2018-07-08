const debug = require('debug')('ahs:apis');
const error = require('http-errors');

module.exports.wrap = call => async (req, res, next) => {
    try {
        res.isRoute = true;
        await call(req, res, next);
    } catch (err) {
        debug(err);
        if (err.response) {
            next(error(err.response.status, err.response.statusText));
            // next({statusCode: err.response.status, message: err.response.statusText, stack: err.stack});
        }
        next(err);
    }
};
