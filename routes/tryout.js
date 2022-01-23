const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync.js');
const tryoutController = require('../controllers/tryout');
const {isLogin} = require('../utilities/mildeware')

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

module.exports = router;