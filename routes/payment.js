const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utilities/catchAsync.js');
const paymentController = require('../controllers/payment');
const {isLogin} = require('../utilities/middleware')

router.route('/')
    .get( catchAsync(paymentController.readPayment))
    .post( catchAsync(paymentController.postPayment))

module.exports = router;