const express = require('express');
const router = express.Router({mergeParams: true});
const multer = require('multer')
const upload = multer({dest: 'upload/'});

const catchAsync = require('../utilities/catchAsync.js');
const questionController = require('../controllers/question');
const {isLogin} = require('../utilities/middleware')

router.route('/')
    .post( upload.single("excel"), isLogin, catchAsync(questionController.createQuestion))

router.route('/:questionId/update')
    .get(isLogin, questionController.updateQuestionPage)

router.route('/:questionId')
    .put(isLogin, questionController.updateQuestion)
    .delete(isLogin, questionController.deleteQuestion)

module.exports = router;