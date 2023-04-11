const express = require('express');

const historyController = require('../controller/searchHistory');

//For user authentication
const userauthentication = require('../middleware/auth');

const router = express.Router();

//router for adding a search history of a user
router.post('/addhistory', userauthentication.authenticate, historyController.addHistory);

//router for getting all the search history of a user
router.get('/gethistory', userauthentication.authenticate, historyController.getHistory);

module.exports = router;