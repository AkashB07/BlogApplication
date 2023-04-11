const express = require('express');

const blogController = require('../controller/blog');

//For user authentication
const userauthentication = require('../middleware/auth');

const router = express.Router();

//router for adding a blog
router.post('/addblog', userauthentication.authenticate, blogController.addBlog);

//router for getting 10 blogs per page
router.get('/get10blogs', userauthentication.authenticate, blogController.get10Blogs);

//router for getting all the blogs
router.get('/getallblogs', userauthentication.authenticate, blogController.getallBlogs);

//router for getting a blog
router.get('/getablog', userauthentication.authenticate, blogController.getaBlog);

module.exports = router;