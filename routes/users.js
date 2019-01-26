var express = require('express');
var router = express.Router();
var axios = require('axios')
var passport = require('passport')

var User = require('../models/user');
var UserController = require('../controllers/api/user');



module.exports = router;