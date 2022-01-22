const Tryout = require('../models/tryout.js')

module.exports.index = async (req, res) => {
    const tryouts = await Tryout.find({})
    res.render('./tryout/index', {tryouts})
};

module.exports.showTryout = async (req, res) => {
    const {tryoutId} = req.params
    const tryouts = await Tryout.findById(tryoutId)
    // console.log(tryoutId)
    // console.log(tryouts)
    res.render('./tryout/show', {tryouts})
};