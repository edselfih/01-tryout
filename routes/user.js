const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utilities/catchAsync.js');
const userController = require('../controllers/user')
const passport = require('passport');

router.route('/user')
    .get(catchAsync(userController.createUserPage))
    .post(userController.createUser)

router.route('/login')
    .get(catchAsync(userController.loginPage))
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), catchAsync(userController.login))

router.get( '/logout', catchAsync(userController.logout))

module.exports = router