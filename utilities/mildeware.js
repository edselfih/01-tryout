module.exports.isLogin = async (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.toRedirect = req.originalUrl
        req.flash('error', 'harus login dulu');
        return res.redirect('/login')
    }
    next()
}