require('dotenv').config()

const crypto = require('crypto');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator')
const { Op } = require("sequelize");

const nodemailer = require('nodemailer');
const sendGridTransporter = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendGridTransporter({
    auth: {
        api_key: process.env.NODEMAIL_APIKEY
    }
}));


exports.getLogin = (req, res, next) => {

};

exports.getSignup = (req, res, next) => {

};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log("errors : ", errors.array());
        return res.status(422).send({
            errorMessage: errors.array()[0].msg
        });
    }

    User.findOne({where: { email: email }})
        .then(user => {
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch){
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        console.log("IsloggedIn : " ,req.session.isLoggedIn);
                        console.log("USER : ",req.session.user);
                        return req.session.save(err => {
                            console.log(err);
                            res.send({
                                path: '/',
                                name: user.name,
                                email: user.email
                            });
                        });
                    }
                    console.log("do match : ", doMatch);
                    return res.status(422).send({
                        errorMessage: "Password has to be valid."
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.send('/login');
                });
        })
        .catch(err => console.log(err));
};

exports.postSignup =  (req, res, next) => {
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log("errors : ", errors.array());
        return res.status(422).send({
            errorMessage: errors.array()[0].msg
        });
    }
    bcrypt.hash(password, 12).then( hashedPassword => {
        User.create({name , email, password: hashedPassword})
            .then(response => {
                console.log(response);
                res.send('/login');
                return transporter.sendMail({
                    to: email,
                    from: 'gregory.ettori@gmail.com',
                    subject: 'Welcome to Random Movie',
                    html: '<h1>Congratulation !</h1>'
                }).catch(error => console.log(error))
            })
            .catch(err => console.log(err))
    }).catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.send({path: '/', isLogged: false});
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buf) => {
        if(err){
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buf.toString('hex');
        User.findOne({where: { email: req.body.email }})
            .then((user) => {
                if(!user){
                    req.flash('error', 'No Account with this email found');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() +9600000;
                return user.save();
            }).then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: req.body.email,
                from: 'gregory.ettori@gmail.com',
                subject: 'Password Reset',
                html: `<h1>Reset Password</h1>
                        <p> click this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</p>`
            }).catch(error => console.log(error))
        })
            .catch(err => console.log(err))
    })
}

exports.postNewPassword = (req, res, next) => {
    console.log(req.body);
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({where : {resetToken: passwordToken, resetTokenExpiration: { [Op.gt]: new Date() }, id: userId}})
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);

        }).then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = null;
        resetUser.resetTokenExpiration = null;
        return resetUser.save();
    }).then(result => {
        res.redirect('/login')
    }).catch(err => console.log(err))
}