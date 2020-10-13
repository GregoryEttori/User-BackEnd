const express = require('express');
const router = express.Router();
const {check, body} = require('express-validator');
const bcrypt = require('bcryptjs');

const authController = require('../controllers/authController');
const User = require('../models/userModel');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({where: { email: value }}).then(userDoc => {
                if (!userDoc) {
                    return Promise.reject(
                        'E-Mail does not exist.'
                    );
                }
            });
        })
        .normalizeEmail(),
    body(
        'password',
        'Password has to be valid.'
    )
        .isLength({ min: 8 })
        .isAlphanumeric()
        .trim()
],authController.postLogin);

router.post('/signup', [
    body('name', 'Please enter your name').not().isEmpty(),
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({where: { email: value }}).then(userDoc => {
                if (userDoc) {
                    return Promise.reject(
                        'E-Mail exists already, please pick a different one.'
                    );
                }
            });
        })
        .normalizeEmail(),
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
    )
        .isLength({ min: 8 })
        .isAlphanumeric()
        .trim(),
    body('passwordConfirmation').trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    })
], authController.postSignup);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
