const Question = require('../models/question.js');
const Section = require('../models/section.js');
const Tryout = require('../models/tryout.js');
const fs = require('fs');
const XLSX = require("xlsx");
const path = require('path');

module.exports.createQuestion = async (req, res) => {
    const {tryoutId} = req.params;

    //upload section only:
    if(req.body.section) {
        const {section, code} = req.body.section
        const newSection = new Section({section, code})
        const tryout = await Tryout.findById(tryoutId)
        tryout.section.push(newSection)
        await newSection.save()
        await tryout.save()
        res.redirect(`/tryout/${tryout._id}`)
    }

    // upload manual:
    if (req.body.question) {
        const {question, choice, key, questionUrl, choiceUrl, code } = req.body.question
        // const inputQuestion = async (key, q, c, gu, cu) => {
        //     const newQuestion = new Question({ key : key, question: q, choice: c, questionUrl: gu, choiceUrl: cu })
        //     console.log(newQuestion)
        //     const tryout = await Tryout.findById(tryoutId)
        //     tryout.question.push(newQuestion)
        //     await newQuestion.save()
        //     await tryout.save()
        //     res.redirect(`/tryout/${tryout._id}`)
        // }
        if(question) {
            if (choice[0].length > 2) {
                const newQuestion = new Question({key, code, question, key, choice })
                const section = await Section.findOne({code})
                section.question.push(newQuestion)
                await section.save()
                await newQuestion.save()
                res.redirect(`/tryout/${tryoutId}`)
                // inputQuestion(key, question, choice, questionUrl, choiceUrl)
            } else {
                const newQuestion = new Question({key, code, question, choiceUrl })
                const section = await Section.findOne({code})
                section.question.push(newQuestion)
                await section.save()
                await newQuestion.save()
                res.redirect(`/tryout/${tryoutId}`)
                // inputQuestion(key, question, choice, questionUrl, choiceUrl)
            }
        } else {
            if (choice[0].length > 2) {
                const newQuestion = new Question({key, code, questionUrl, choice })
                const section = await Section.findOne({code})
                section.question.push(newQuestion)
                await section.save()
                await newQuestion.save()
                res.redirect(`/tryout/${tryoutId}`)
                // inputQuestion(key, question, choice, questionUrl, choiceUrl)
            } else {
                const newQuestion = new Question({key, code, questionUrl, choiceUrl })
                const section = await Section.findOne({code})
                section.question.push(newQuestion)
                await section.save()
                await newQuestion.save()
                res.redirect(`/tryout/${tryoutId}`)
                // inputQuestion(key, question, choice, questionUrl, choiceUrl)
            }
        }
    } 
    // untuk upload via excel
    if (req.file) {
        const workbook = XLSX.readFile(`./upload/${req.file.filename}`);
        const sheet_name_list = workbook.SheetNames;
        let step = 1
        sheet_name_list.forEach(async function (y) {
            const worksheet = workbook.Sheets[y];
            const questions = XLSX.utils.sheet_to_json(worksheet);
            for (const question of questions){
                console.log(`ini harusnya ada 5`)
                //step 1
                if(question.section ) {
                    const newSection = new Section({section: question.section, code: question.code})
                    const tryout = await Tryout.findById(tryoutId)
                    tryout.section.push(newSection)
                    await newSection.save()
                    await tryout.save()
                    console.log(`selesai upload section`)
                    step = 2
                }
                //step 2
                async function uploadQuestion() {
                    if ((question.question || question.questionUrl) && step === 2) {
                        const choice = [];
                        const choiceUrl = [];
                        const key = ['A','B','C','D','E']
                        for (let i = 0; i < 5 ; i++) {
                            if(question.choice_A) {
                                choice.push(question[`choice_${key[i]}`])
                            } else {
                                choiceUrl.push(question[`choiceUrl_${key[i]}`])
                            }
                        }
                        console.log(question.choice_A)
                        if (question.question) {
                            if(question.choice_A) {
                                const newQuestion = new Question({question: question.question, key: question.key.toLowerCase().trim(), choice, code : question.code})
                                const section = await Section.findOne({code: question.code})
                                section.question.push(newQuestion)
                                await newQuestion.save()
                                await section.save()
                                console.log(`qtext ctext`)

                            } else {
                                const newQuestion = new Question({question: question.question, key: question.key.toLowerCase().trim(), choiceUrl, code : question.code})
                                const section = await Section.findOne({code: question.code})
                                section.question.push(newQuestion)
                                await newQuestion.save()
                                await section.save()
                                console.log(`qtext cg`)

                            }
                        }
                        if(!question.question) {
                            if(question.choice_A) {
                                const newQuestion = new Question({questionUrl: question.questionUrl, key: question.key.toLowerCase().trim(), choice, code : question.code})
                                const section = await Section.findOne({code: question.code})
                                section.question.push(newQuestion)
                                await newQuestion.save()
                                await section.save()
                                console.log(`qg ctext`)

                            } else {
                                const newQuestion = new Question({questionUrl: question.questionUrl, key: question.key.toLowerCase().trim(), choiceUrl, code : question.code})
                                const section = await Section.findOne({code: question.code})
                                section.question.push(newQuestion)
                                await newQuestion.save()
                                await section.save()
                                console.log(`qg cg`)

                            }
                        }
                        console.log(`upload question berhasil`)
                    }
                }
                setTimeout(uploadQuestion, 1000)
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
        });
    }
    res.redirect(`/tryout/${tryoutId}`)
};

module.exports.updateQuestionPage = async (req, res) => {
    const {tryoutId, questionId} = req.params;
    const tryouts  = await Tryout.findById(tryoutId);
    const questions = await Question.findById(questionId);
    res.render(`./question/admin/update`, {questions, tryouts});
};

// yg url belum
module.exports.updateQuestion = async (req, res) => {
    const {question, choice, key, code} = req.body.question
    const {tryoutId,questionId} = req.params;
    const updatedQuestion = await Question.findByIdAndUpdate( questionId ,{question, choice, key, code}, {runValidators: true, new: true});
    await Section.findOneAndUpdate({question: { $in: questionId}}, {$pull: {question: questionId}});
    const selectedSection = await Section.findOne({code})
    selectedSection.question.push(updatedQuestion)
    await selectedSection.save();
    res.redirect(`/tryout/${tryoutId}`);
};

module.exports.deleteQuestion = async (req, res) => {
    const {tryoutId, questionId} = req.params
    await Tryout.findByIdAndUpdate(tryoutId, {$pull: {question: questionId}})
    await Question.findByIdAndDelete(questionId)
    res.redirect(`/tryout/${tryoutId}`)
};

module.exports.updateSectionPage = async (req, res) => {
    const {tryoutId, sectionId} = req.params;
    const tryouts  = await Tryout.findById(tryoutId);
    const sections = await Section.findById(sectionId);
    res.render(`./question/admin/updateSection`, {sections, tryouts});
};

module.exports.updateSection = async (req, res) => {
    const {section, code} = req.body.section
    const {tryoutId,sectionId} = req.params;
    await Section.findByIdAndUpdate( sectionId ,{section, code}, {runValidators: true, new: true});
    res.redirect(`/tryout/${tryoutId}`);
};

module.exports.deleteSection = async (req, res) => {
    const {tryoutId, sectionId} = req.params
    await Tryout.findByIdAndUpdate(tryoutId, {$pull: {section: sectionId}})
    await Section.findByIdAndDelete(sectionId)
    res.redirect(`/tryout/${tryoutId}`)
};