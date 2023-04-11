const express = require('express');

const commentController = require('../controller/comment');

//For user authentication
const userauthentication = require('../middleware/auth');

const router = express.Router();

//router for adding a comment for a blog
router.post('/addcomment', userauthentication.authenticate, commentController.addComment);

//router for getting all the comment for a blog
router.get('/getcomments', userauthentication.authenticate, commentController.getComments);


module.exports = router;