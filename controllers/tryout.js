const Tryout = require('../models/tryout.js')

module.exports.index = async (req, res) => {
    const tryouts = await Tryout.find({})
    res.render('./tryout/index', {tryouts})
};