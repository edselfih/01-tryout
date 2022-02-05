const Question = require('../models/question.js');
const Tryout = require('../models/tryout.js');
const fs = require('fs');
const XLSX = require("xlsx");
const path = require('path');

module.exports.createQuestion = async (req, res) => {
    const {tryoutId} = req.params;
    if (req.body.question) {
        const {question, choice, key} = req.body.question
        const newQuestion = new Question({ question, key, choice })
        const tryout = await Tryout.findById(tryoutId)
        tryout.question.push(newQuestion)
        await newQuestion.save()
        await tryout.save()
        res.redirect(`/tryout/${tryout._id}`)
    } else {
        const workbook = XLSX.readFile(`./upload/${req.file.filename}`);
        const sheet_name_list = workbook.SheetNames;      
        sheet_name_list.forEach(async function (y) {
            const worksheet = workbook.Sheets[y];
            const questions = XLSX.utils.sheet_to_json(worksheet); 
                for (const question of questions ) { 
                    const choice = []
                    const key = ['A','B','C','D','E']
                    for (let i = 0; i < 5 ; i++) {
                        choice.push(question[`choice_${key[i]}`])
                    }
                    const newQuestion = new Question({question: question.question, key: question.key.toLowerCase().trim(), choice})
                    const tryout = await Tryout.findById(tryoutId)
                    tryout.question.push(newQuestion)
                    await newQuestion.save()
                    await tryout.save()
                }
            const directory = 'upload';
            fs.readdir(directory, (err, files) => { 
                if (err) throw err; 
                for (const file of files) { 
                    fs.unlink(path.join(directory, file), err => { 
                        if (err) throw err; 
                    });
                }
            });
            res.redirect(`/tryout/${tryoutId}`)
        });
    }

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
