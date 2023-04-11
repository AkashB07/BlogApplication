const Blog = require('../model/blog');
const TagHistory = require('../model/tagHistory');
const BlogHistory = require('../model/blogHistory');

const Sequelize = require('sequelize');

//To use SQL operators
const Op = Sequelize.Op;

const ITEAM_PER_PAGE=10;

//To verify the variable
function isstringinvalid(string) {
    if (string == undefined || string.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

//Adding a single blog to database
const addBlog = async (req, res) => {
    try {
        const { creator, title, details, blog, tags } = req.body;
        const userId = req.user.id;
        if (isstringinvalid(title) || isstringinvalid(details) || isstringinvalid(blog) || isstringinvalid(tags)) {
            return res.status(400).json({ message: 'title or details or blog or tags is missing', success: false });
        }
        await Blog.create({ creator: creator, title: title, details: details, blog: blog, tags: tags, userId: userId });
        return res.status(201).json({success: true, message: 'Blog has been added'});
    }
    catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}

//Getting 10 bloges per page from the database
const get10Blogs = async (req, res) => {
    try {
        const tag = req.query.tag;
        const page = (+req.query.page || 1);
        const total_items = await Blog.count({where: {tags: {[Op.like]: `%${tag.toLowerCase()}%`} } });
        const blogs = await Blog.findAll({where: {tags: {[Op.like]: `%${tag.toLowerCase()}%`} }, order:[['createdAt','DESC']],
        offset:(page-1)*ITEAM_PER_PAGE,limit:ITEAM_PER_PAGE});

        return res.status(200).json({blogs: blogs, 
            totalItems: total_items,
            hasNextPage: (page*ITEAM_PER_PAGE<total_items),
            hasPreviousPage: page>1,
            currentPage:page,
            nextPage:page+1,
            previousPage:page-1,
            lastPage:(Math.ceil(total_items/ITEAM_PER_PAGE)),
            succese: true
        });        
    }
    catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}

//Geting all the blogs from the database
const getallBlogs = async (req, res) => {
    try {
        const tag = req.query.tag;
        const response = await Blog.findAll({
            where: {
                tags: {
                    [Op.like]: `%${tag.toLowerCase()}%`
                }
            },
            order:[['createdAt','DESC']]
        })
        if(response.length>0){
            return res.status(200).json({success: true, message: 'Results for tag is found', data: response});
        }
        else {
            return res.status(200).json({success: false, message: 'Results for tag is not found'});
        }
    }
    catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}


//Getting a single blog from the database
const getaBlog = async (req, res) => {
    try {
        const blogId = (+req.query.blogId);
        const userId = req.user.id;
        const blog = await Blog.findByPk(blogId);

        //Storing the tags(tag history) in the databse which has been viewed by the user
        const tags = blog.tags.split(', ');
        for(let i=0; i<tags.length; i++){
            const existingTag = await TagHistory.findOne({ where: { tag: tags[i], userId: userId } });
            if(existingTag) {
                await existingTag.increment({viewed: 1});
            }
            else {
                await TagHistory.create({ tag: tags[i], userId: userId });;
            }
        }

        //Storing the blogs(blog history) in the databse which has been viewed by the user
        const existingBlog = await BlogHistory.findOne({ where: { blogId: blogId, userId: userId } });
        if(existingBlog) {
            await existingBlog.increment({viewed: 1});
        }
        else {
            await BlogHistory.create({ title: blog.title, blogId: blogId, userId: userId });;
        }

        return res.status(200).json({success: true, message: 'Blog is found', blog: blog});   
    }
    catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}

//To export the functions
module.exports = {
    addBlog,
    getallBlogs,
    get10Blogs,
    getaBlog 
}