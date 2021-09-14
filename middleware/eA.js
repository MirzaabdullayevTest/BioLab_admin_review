const eA = (req, res, next) => {
    res.locals.isAuth = req.session.isAuthenticated
    next()
}
module.exports = eA;