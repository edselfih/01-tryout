const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync.js');
const tryoutController = require('../controllers/tryout');

router.route('/')
    .get( tryoutController.index );

module.exports = router;