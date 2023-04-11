const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//Creating Blog table
const Blog = sequelize.define('blog', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    creator: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title: {
       type: Sequelize.STRING,
       allowNull: false
    },
    details: {
        type: Sequelize.STRING,
        allowNull: false
    },
    blog: {
        type: Sequelize.TEXT('long'),
        allowNull: false
    },
    tags: {
        type: Sequelize.STRING
    },
    totallikes: {
        type:  Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
     },
    totaldislikes: {
       type:  Sequelize.INTEGER,
       allowNull: false,
       defaultValue: 0
    },
    totalcomments: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
})

module.exports = Blog;