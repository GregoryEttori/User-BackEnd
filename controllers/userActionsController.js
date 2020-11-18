require('dotenv').config()

const crypto = require('crypto');
const User = require('../models/userModel');
const WatchLaterFilms = require('../models/watchLaterFilmsModel');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");


exports.postAddToWishlist = (req, res, next) => {
    console.log('req USER : ',req.user);

    const filmId = req.body.filmId;
    const title = req.body.title;
    const year = req.body.year;
    const overview = req.body.overview;
    const poster_path = req.body.poster_path;

    WatchLaterFilms.create({
            filmId,
            userId:req.user.id,
            title,
            year,
            overview,
            poster_path
        })
        .then(response => {
            WatchLaterFilms.findAll({where: {userId:req.user.id}})
                .then(filmList => {
                    res.send({
                        message: 'Movie has been added to your profile.',
                        wishlist: filmList,
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

}

exports.postDeleteMovie = (req, res, next) => {
    filmdId = req.body.data.filmId;
    WatchLaterFilms.findOne({where: {filmId: filmdId, userId: req.user.id}})
        .then(film => {
            film.destroy()
                .then(() => {
                    WatchLaterFilms.findAll({where: {userId:req.user.id}})
                    .then(filmList => {
                        res.send({
                            message: 'Film has been delete',
                            wishList: filmList,
                        });
                    })
                    .catch(err => console.log(err))
                .catch(err => console.log(err));
                })
        })
        .catch(err => console.log(err))
}