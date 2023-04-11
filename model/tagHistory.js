const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//Creating TagHistory table
const TagHistory = sequelize.define('tagHistory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    tag: {
        type:  Sequelize.STRING,
        allowNull: false
    },
    viewed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
})

module.exports = TagHistory;