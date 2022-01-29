module.exports.isLogin = async (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.toRedirect = req.originalUrl
        req.flash('error', 'harus login dulu');
        return res.redirect('/login')
    }
    if(!req.user.verified){
        req.session.toRedirect = req.originalUrl
        req.flash('error', 'verifiksi akun anda');
        return res.redirect('/user/verification')
    }
    next()
}

module.exports.isVerifiedEmail = async (req, res, next) => {
    if(!req.session.validUser){
        req.flash('error', 'email tidak terverifikasi');
        return res.redirect('/login')
    }
    next()
}