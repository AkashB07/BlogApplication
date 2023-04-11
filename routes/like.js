const express = require('express');

const likeController = require('../controller/like');

//For user authentication
const userauthentication = require('../middleware/auth');

const router = express.Router();

//router for liking a blog
router.post('/likes', userauthentication.authenticate, likeController.likes);

//router for disliking a blog
router.post('/dislikes', userauthentication.authenticate, likeController.dislikes);

//router find if the blog has been liked or disliked
router.get('/likeordislike', userauthentication.authenticate, likeController.likeOrDislike);

//router for getting total likes and dislike for a blog
router.get('/countlike', userauthentication.authenticate, likeController.countLike);

module.exports = router;