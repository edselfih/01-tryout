const User = require('../models/user.js');

module.exports.createUserPage = async (req, res) => {
    res.render('./user/create')
}

module.exports.createUser = async (req, res) => {
    try {
        const {username, email, password} = req.body
        const user = await new User({username, email})
        const newUser = await User.register(user, password)
        console.log(newUser)
        req.login(user, function(err) {
            if (err) { return next(err); }
            req.flash('success', 'sukses membuat user')
            res.redirect(`/`)
        });
    } catch (e) {
        req.flash('error', e.message)
        res.redirect(`/user`)
    }

}

module.exports.loginPage = async (req, res) => {
    res.render('./user/login')
}

module.exports.login = (async (req, res) => {
    req.flash('success', 'selamat datang');
    const toRedirect = req.session.toRedirect || '/';
    req.session.toRedirect = null;
    res.redirect(toRedirect);

})

module.exports.logout = async (req, res) => {
    req.logout();
    req.flash('success', 'bye');
    res.redirect('/')
}