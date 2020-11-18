const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const WatchLaterFilms = sequelize.define('watchLaterFilms', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    filmId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    overview: {
        type: Sequelize.TEXT('long'),
        allowNull: false
    },
    poster_path: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports = WatchLaterFilms;