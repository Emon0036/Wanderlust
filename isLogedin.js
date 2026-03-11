module.exports.isLogedIn = (req, res, next) => {
    if (!req.isAuthenticated())
    {
        req.flash("error", "Login first");
        return res.redirect("/login");
    }
    next();
};
