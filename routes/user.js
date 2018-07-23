var express = require('express');
var router = express.Router();
var db = require('ahs-persistence');
var request = require('../middleware/RequestWrapper')
var GoogleHelpers = require('../helpers/GoogleHelpers')
var verify = require('../middleware/JWTHelpers')
var _ = require('lodash');


/* GET users listing. */
router.get('/', verify.jwt, request.wrap( async (req, res, next) =>{
  let { token } = res.locals;
  let user = await db.user.GetUserInfo({id: token.id});
  let classes = await GoogleHelpers.GetClasses({accessToken: user.googleToken, isTeacher: user.isTeacher});




  res.locals = user;
  res.status(200);
  next();
}));



module.exports = router;


