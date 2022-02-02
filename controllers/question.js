const Question = require('../models/question.js');
const Tryout = require('../models/tryout.js');

module.exports.createQuestion = async (req, res) => {
    const {tryoutId} = req.params
    const {question, choice, key} = req.body.question
    const newQuestion = new Question({ question, key, choice })
    const tryout = await Tryout.findById(tryoutId)
    tryout.question.push(newQuestion)    // harus dikasih array biar bisa dipush
    await newQuestion.save()
    await tryout.save()
    res.redirect(`/tryout/${tryout._id}`)
};

module.exports.updateQuestionPage = async (req, res) => {
    const {tryoutId, questionId} = req.params;
    const tryouts  = await Tryout.findById(tryoutId);
    const questions = await Question.findById(questionId);
    console.log(tryouts)
    res.render(`./question/admin/update`, {questions, tryouts});
};

module.exports.updateQuestion = async (req, res) => {
    const {question, choice, key} = req.body.question
    const {tryoutId,questionId} = req.params;
    const newQuestion = await Question.findByIdAndUpdate( questionId ,{question, choice, key}, {runValidators: true, new: true});
    res.redirect(`/tryout/${tryoutId}`);
};

module.exports.deleteQuestion = async (req, res) => {
    const {tryoutId, questionId} = req.params
    await Tryout.findByIdAndUpdate(tryoutId, {$pull: {question: questionId}})
    await Question.findByIdAndDelete(questionId)
    res.redirect(`/tryout/${tryoutId}`)
}
