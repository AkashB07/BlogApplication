//To keep secure variable or keys out of the project
const dotnev = require('dotenv');
dotnev.config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const sequelize=require('./util/database')
const app = express();

//To enable browser to acess resourse
app.use(cors());

//To parse the incoming request
app.use(express.json());

//models
const User = require('./model/user');
const Blog = require('./model/blog');
const SearchHistory = require('./model/searchHistory');
const Like = require('./model/like');
const Comment = require('./model/comment');
const TagHistory = require('./model/tagHistory');
const BlogHistory = require('./model/blogHistory');

//routes
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const searchHistoryRoutes = require('./routes/searchHistory');
const likeRouter = require('./routes/like');
const commentRouter = require('./routes/comment');

//Routers
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);
app.use('/searchhistory', searchHistoryRoutes);
app.use('/like', likeRouter);
app.use('/comment', commentRouter)

//To redirect different routes to view
app.use((req, res) => {
    res.sendFile(path.join(__dirname, `view/${req.url}`))
});

//Database Relationships One-to-Many Relationships

//One-to-Many Relationships
//One Useer can create multiple blogs
User.hasMany(Blog);
Blog.belongsTo(User);

//One-to-Many Relationships
//One Useer can have multiple search history
User.hasMany(SearchHistory);
SearchHistory.belongsTo(User);

//One-to-Many Relationships
//One User can like or unlike multiple blogs(But only one like or unlike for single blog)
User.hasMany(Like);
Like.belongsTo(User);

//One-to-Many Relationships
//One Blog can have many likes or unlikes(But only one like or unlike by single user)
Blog.hasMany(Like);
Like.belongsTo(Blog);

//One-to-Many Relationships
//One User can comment multiple blogs(But only one comment for single blog)
User.hasMany(Comment);
Comment.belongsTo(User);

//One-to-Many Relationships
//One Blog can have many comments(But only comment by single user)
Blog.hasMany(Comment);
Comment.belongsTo(Blog);

//One-to-Many Relationships
//One user can have multiple tag history
User.hasMany(TagHistory);
TagHistory.belongsTo(User);

//One-to-Many Relationships
//One Blog can have many views
Blog.hasMany(BlogHistory);
BlogHistory.belongsTo(Blog);

//One-to-Many Relationships
//One User can see blog many times
User.hasMany(BlogHistory);
BlogHistory.belongsTo(User);

// Creates models, dropping if it already exists
// sequelize.sync({force:true})
// To automatically synchronize all modules or automatically performs querys
sequelize.sync()
.then(()=>{
    //Listens to the connecton on specified port
    app.listen(process.env.PORT);
})
.catch(err=>{
    console.log(err)})