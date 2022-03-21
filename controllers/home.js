const Tryout = require('../models/tryout.js');

module.exports.index = async (req, res) => {
    const tryout = await Tryout.findOne({ display: true });
    res.render('./index', {tryout});
};