const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//Creating BlogHistory table
const BlogHistory = sequelize.define('blogHistory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type:  Sequelize.STRING,
        allowNull: false
    },
    viewed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
})

module.exports = BlogHistory;