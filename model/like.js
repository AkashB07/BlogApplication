const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//Creating Like table
const Like = sequelize.define('like', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    likes: {
        type:  Sequelize.BOOLEAN,
        allowNull: false
     },
    dislikes: {
       type:  Sequelize.BOOLEAN,
       allowNull: false
    }
})

module.exports = Like;