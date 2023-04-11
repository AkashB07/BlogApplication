const express = require('express');

const userController = require('../controller/user');

//For user authentication
const userauthentication = require('../middleware/auth');

const router = express.Router();

router.post('/signup', userController.signup);

router.post('/signin', userController.signin);

router.get('/issignin', userauthentication.authenticate, userController.issignin);


module.exports = router;