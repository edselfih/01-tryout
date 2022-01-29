const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utilities/catchAsync.js');
const userController = require('../controllers/user')
const passport = require('passport');
const {isVerifiedEmail} = require('../utilities/middleware')

router.route('/user/forgot')
    .get(catchAsync(userController.updateUserPasswordPage))
    .post(catchAsync(userController.updateUserPassword))

router.route('/user/forgot/t')
    .post(catchAsync(userController.updateUserPasswordToken))

router.route('/user/token')
    .post(catchAsync(userController.resendToken))

router.route('/user/verification')
    .get(catchAsync(userController.userVerificationPage))
    .post(catchAsync(userController.userVerification))

router.route('/user/:userId/update')
    .get(isVerifiedEmail, catchAsync(userController.updateUserPage))

router.route('/user/:userId')
    .patch(isVerifiedEmail, catchAsync(userController.updateUser))

router.route('/user')
    .get(catchAsync(userController.createUserPage))
    .post(userController.createUser)

router.route('/login')
    .get(catchAsync(userController.loginPage))
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), catchAsync(userController.login))

router.get( '/logout', catchAsync(userController.logout))

module.exports = router