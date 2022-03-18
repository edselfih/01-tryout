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

router.route('/:tryoutId/payment')
    .get( catchAsync(tryoutController.createPaymentPage))
    .post( catchAsync(tryoutController.createPayment))

router.route('/:tryoutId/payment/:orderId')
    .get( catchAsync(tryoutController.confirmPayment))

router.route('/:tryoutId/update')
    .get( isLogin, tryoutController.updateTryoutPage );

module.exports = router;