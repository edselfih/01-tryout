const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync.js');
const homeController = require('../controllers/home');

router.route('/')
    .get( catchAsync(homeController.index));


module.exports = router;