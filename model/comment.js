const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//Creating Comment table
const Comment = sequelize.define('comment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    comments: {
        type: Sequelize.TEXT('long'),
        allowNull: false
    },
    by: {
        type:  Sequelize.STRING,
        allowNull: false
    }  
})

module.exports = Comment;