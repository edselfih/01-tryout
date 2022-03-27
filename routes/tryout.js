const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync.js');
const tryoutController = require('../controllers/tryout');
const {isLogin} = require('../utilities/middleware')

router.route('/')
    .get( tryoutController.index )
    .post( isLogin, tryoutController.createTryout );

router.route('/create')
    .get( isLogin, tryoutController.createTryoutPage ); 

router.route('/:tryoutId')
    .get( isLogin, tryoutController.readTryout )
    .put( isLogin, tryoutController.updateTryout )
    .delete( isLogin, tryoutController.deleteTryout )

router.route('/:tryoutId/update')
    .get( isLogin, tryoutController.updateTryoutPage );

// payment:

router.route('/:tryoutId/payment')
    .post( catchAsync(tryoutController.createToken))

router.route('/:tryoutId/payment/:tokenId')
    .get( catchAsync(tryoutController.createPayment))

router.route('/payment/finish')
    .get( catchAsync(tryoutController.finishPay))

module.exports = router;