module.exports.isLogedIn = (req, res, next) => {
    if (!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login first");
        return res.redirect("/login");
    }
    next();
};


//to save original url

module.exports.originalUrl = (req,res,next)=>{
    if(req.session.redirectUrl)
    {
       res.locals.originalUrl = req.session.redirectUrl;
    }
  next();

};
