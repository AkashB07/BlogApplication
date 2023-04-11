const Like = require('../model/like');
const Blog = require('../model/blog');

//To like a comment or undo the like
const likes = async (req, res) =>  {
    try 
    {
        const{ blogId, result } = req.body;
        const userId = req.user.id;

        //If already liked and stored in the database
        const like = await Blog.findByPk(blogId);
        const existing  = await Like.findOne({ where: { userId:userId, blogId:blogId } });
        if(existing){
            if(result === 2){  
                await Like.update({likes: true, dislikes: false}, {
                    where: {
                      userId: userId, blogId: blogId
                    }
                  });
                //Incrementing the total likes count for a blog
                await like.increment({totallikes: 1});
                return res.status(201).json({success: true, message: 'Blog as been liked'});
            }
            if(result === 1) {
                await Like.update({likes: false, dislikes: false}, {
                    where: {
                      userId: userId, blogId: blogId
                    }
                  });
                //Decrementing the total comment count for a blog
                await like.decrement({'totallikes': 1});
                return res.status(201).json({success: true, message: 'Blog as not been liked'});
            }
        }

        //If liking for first time and not stored in the database
        if(result === 2){
            await Like.create({likes: true, dislikes: false, userId:userId, blogId:blogId});
            //Incrementing the total comment count for a blog
            await like.increment({totallikes: 1});
            return res.status(201).json({success: true, message: 'Blog as been liked'});
        }
        if(result === 1) {
            await Like.create({likes: false, dislikes: false, userId:userId, blogId:blogId});
             //Decrementing the total comment count for a blog
            await like.decrement({'totallikes': 1});
            return res.status(201).json({success: true, message: 'Blog as not been liked'});
        }
  
    } 
    catch (error) {
        res.status(500).json({message: error, success: false});
    }
}

//To dislike a comment or undo the dislike
const dislikes = async (req, res) =>  {
    try 
    {
        const{ blogId, result } = req.body;
        const userId = req.user.id;

        //If already disliked and stored in the database
        const dislike = await Blog.findByPk(blogId);
        const existing  = await Like.findOne({ where: { userId:userId, blogId:blogId } });
        if(existing){
            if(result === 2){  
                await Like.update({likes: false, dislikes: true}, {
                    where: {
                      userId: userId, blogId: blogId
                    }
                  });
                //Incrementing the total dislikes count for a blog
                await dislike.increment({'totaldislikes': 1});
                return res.status(201).json({success: true, message: 'Blog as been unliked'});
            }
            if(result === 1) {
                await Like.update({likes: false, dislikes: false}, {
                    where: {
                      userId: userId, blogId: blogId
                    }
                  });
                //Decrementing the total dislikes count for a blog
                await dislike.decrement({'totaldislikes': 1});
                return res.status(201).json({success: true, message: 'Blog as not been unliked'});
            }
        }

        //If unliking for first time and not stored in the database
        if(result === 2){
            await Like.create({likes: false, dislikes: true, userId:userId, blogId:blogId});
            //Incrementing the total dislikes count for a blog
            await dislike.increment({'totaldislikes': 1});
            return res.status(201).json({success: true, message: 'Blog as been unliked'});
        }
        if(result === 1) {
            await Like.create({likes: false, dislikes: false, userId:userId, blogId:blogId});
            //Decrementing the total dislikes count for a blog
            await dislike.decrement({'totaldislikes': 1});
            return res.status(201).json({success: true, message: 'Blog as not been unliked'});
        } 
    } 
    catch (error) {
        res.status(500).json({message: error, success: false});
    }
}

//To find a blog as been liked or disliked for a single user
const likeOrDislike = async (req, res) =>  {
    try 
    {
        const blogId = (+req.query.blogId);
        const userId = req.user.id;
        
        const existing  = await Like.findOne({ where: { userId:userId, blogId:blogId } });
        if(existing){
            return res.status(200).json({success: true, message: 'Blog as been liked or unliked', like: existing});
        }
        else{
            return res.status(200).json({success: false, message: 'Blog as not been liked or unliked'});
        }
    } 
    catch (error) {
        res.status(500).json({message: error, success: false});
    }
}

//To count the number of likes and dislikes for a blog
const countLike = async (req, res) => {
    try 
    {
        const blogId = (+req.query.blogId);
        const likes = await Like.count({ where: { likes: true, blogId:blogId } });;
        const dislikes = await Like.count({ where: { dislikes: true, blogId:blogId } });;
        if(likes || dislikes) {
            return res.status(200).json({success: true, message: 'Count is found for like or dislike', likes: likes, dislikes: dislikes});
        }
        return res.status(200).json({success: false, message: 'Count is not found for like or dislike'});
    } 
    catch (error) {
        res.status(500).json({message: error, success: false});
    }
}

//To export the functions
module.exports = {
    likes,
    dislikes,
    likeOrDislike,
    countLike
};