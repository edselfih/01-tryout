const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync.js');
const tryoutController = require('../controllers/tryout');

router.route('/')
    .get( tryoutController.index )
    .post( tryoutController.createTryout );

router.route('/create')
    .get( tryoutController.createTryoutPage ); 

router.route('/:tryoutId')
    .get( tryoutController.readTryout )
    .put( tryoutController.updateTryout )
    .delete( tryoutController.deleteTryout )

router.route('/:tryoutId/update')
    .get( tryoutController.updateTryoutPage );

module.exports = router;