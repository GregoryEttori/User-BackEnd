const Sequelize = require('sequelize');

const sequelize = new Sequelize('User', 'root', 'cucuagneau', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;