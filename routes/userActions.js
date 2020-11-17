const express = require('express');
const router = express.Router();
const {check, body} = require('express-validator');
const bcrypt = require('bcryptjs');

const userActionsController = require('../controllers/userActionsController');
const User = require('../models/userModel');


router.post('/add-to-wishlist', userActionsController.postAddToWishlist);

module.exports = router;
