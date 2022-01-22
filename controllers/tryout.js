const Tryout = require('../models/tryout.js');

module.exports.index = async (req, res) => {
    const tryouts = await Tryout.find({});
    res.render('./tryout/index', {tryouts});
};

module.exports.readTryout = async (req, res) => {
    const {tryoutId} = req.params;
    const tryouts = await Tryout.findById(tryoutId);
    // console.log(tryoutId)
    // console.log(tryouts)
    res.render('./tryout/read', {tryouts});
};

module.exports.createTryoutPage = async (req, res) => {
    res.render('./tryout/create');
};

module.exports.createTryout = async (req, res) => {
    const tryouts = new Tryout(req.body.tryout);
    await tryouts.save();
    res.redirect(`/tryout/${tryouts._id}`);
};

module.exports.updateTryoutPage = async (req, res) => {
    const {tryoutId} = req.params;
    const tryouts = await Tryout.findById(tryoutId);
    res.render(`./tryout/update`, {tryouts});
};

module.exports.updateTryout = async (req, res) => {
    const { title, description} = req.body.tryout
    const {tryoutId} = req.params
    const tryouts = await Tryout.findByIdAndUpdate( tryoutId ,{title, description}, {runValidators: true, new: true});
    res.redirect(`/tryout/${tryouts._id}`);
};

module.exports.deleteTryout = async (req, res) => {
    const {tryoutId} = req.params
    await Tryout.findByIdAndDelete(tryoutId)
    res.redirect('/tryout')
}