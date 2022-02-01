const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utilities/catchAsync.js');
const questionController = require('../controllers/question');
const {isLogin} = require('../utilities/middleware')

router.route('/')
    .post(isLogin, questionController.createQuestion)

router.route('/:questionId/update')
    .get(isLogin, questionController.updateQuestionPage)

router.route('/:questionId')
    .put(isLogin, questionController.updateQuestion)
    .delete(isLogin, questionController.deleteQuestion)

module.exports = router;