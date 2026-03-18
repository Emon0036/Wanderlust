const listing = require("./model/listing");
const customError = require("./Utility/expressError.js");
const { listingSchema, reviewSchema } = require("./Schema.js");



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


//middleware to check the ownerId

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let malik = await listing.findById(id);
    if(!malik.owner.equals( res.locals.userInfo._id))
    {
        req.flash("error","You are not the owner.");
        return res.redirect(`/listing/${id}`);
    }
    next();
}


//Schema validate middleware
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error)
    {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new customError(404, errMsg);
    }
    else
    {
        next();
    }
}

//review validation
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new customError(404, errMsg);
    }
    else {
        next();
    }
};