const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//Creating SearchHistory table
const SearchHistory = sequelize.define('searchHistory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    search: {
        type:  Sequelize.STRING,
        allowNull: false,
        unique: true
     }
})

module.exports = SearchHistory;