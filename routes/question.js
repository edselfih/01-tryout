const express = require('express');
const router = express.Router({mergeParams: true});
const multer = require('multer')
const upload = multer({dest: 'upload/'});

const catchAsync = require('../utilities/catchAsync.js');
const questionController = require('../controllers/question');
const {isLogin} = require('../utilities/middleware')

router.route('/question')
    .post( upload.single("excel"), isLogin, catchAsync(questionController.createQuestion))

router.route('/question/:questionId/update')
    .get(isLogin, questionController.updateQuestionPage)

router.route('/question/:questionId')
    .put(isLogin, questionController.updateQuestion)
    .delete(isLogin, questionController.deleteQuestion)

router.route('/section/:sectionId/update')
    .get(isLogin, questionController.updateSectionPage)

router.route('/section/:sectionId')
    .put(isLogin, questionController.updateSection)
    .delete(isLogin, questionController.deleteSection)

module.exports = router;