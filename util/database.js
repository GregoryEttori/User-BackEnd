require('dotenv').config()


const Sequelize = require('sequelize');

const sequelize = new Sequelize('User', 'root', process.env.DB_PASS, {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;