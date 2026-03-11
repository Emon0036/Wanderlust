const express = require("express");
const router = express.Router({mergeParams:true});
const { listingSchema, reviewSchema } = require("../Schema.js");
const Review = require("../model/review.js");
const wrapAsyn = require("../Utility/wrapAsyn.js");
const Listing = require("../model/listing.js");
const customError = require("../Utility/expressError.js"); 



const validateReview = (req, res, next) => {
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


//review section
router.post("/",validateReview,wrapAsyn(async (req, res) => {

    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);


    listing.review.push(newReview);
    
    await newReview.save();
    await listing.save();

    req.flash("success", "New reveiw has created");

     res.redirect(`/listing/${id}`);

  
}));

//delete review
router.delete("/:reviewId", wrapAsyn(async (req,res) => {
    
    let { id, reviewId } = req.params;

    let res1 = await Review.findOneAndDelete(reviewId);
    console.log(res1);

    let res2 = await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    console.log(res2);
    req.flash("success", "Reveiw has Deleted");
    res.redirect(`/listing/${id}`);
}
));


module.exports = router;