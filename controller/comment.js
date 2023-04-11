const Comment = require('../model/comment');
const Blog = require('../model/blog');

//To verify the variable
function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
}

//Adding a comment to a blog
const addComment = async (req, res) => {
    try 
    {
        const { comment, blogId } = req.body;
        const userId = req.user.id;
        const by = req.user.name;
        if (isstringinvalid(comment)) {
            return res.status(400).json({ message: 'Please enter a valid comment', success: false });
        }
        await Comment.create({ comments: comment, by: by, userId: userId, blogId: blogId });

        //Incrementing the total comment count for a blog
        const comments = await Blog.findByPk(blogId);
        await comments.increment({totalcomments: 1});
        return res.status(201).json({success: true, message: 'Comment has been added'});
    } 
    catch (error) {
        res.status(500).json({message: error, success: false});
    }
}

//Getting the comments for a blog
const getComments = async (req, res) => {
    try 
    {
        const blogId = (+req.query.blogId);
        const response = await Comment.findAll({
            where: {
                blogId: blogId
            },
            order:[['createdAt','DESC']]
        })
        return res.status(200).json({success: true, message: 'Comment has been found', comment: response});
    } 
    catch (error) {
        res.status(500).json({message: error, success: false});
    }
}

//To export the functions
module.exports = {
    addComment,
    getComments
};