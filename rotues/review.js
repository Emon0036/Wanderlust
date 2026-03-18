const express = require("express");
const router = express.Router({mergeParams:true});
const { listingSchema, reviewSchema } = require("../Schema.js");
const Review = require("../model/review.js");
const wrapAsyn = require("../Utility/wrapAsyn.js");
const Listing = require("../model/listing.js");
const customError = require("../Utility/expressError.js");
const {isLogedIn,validateReview} = require("../isLogedin.js");






//review section
router.post("/", isLogedIn, validateReview, wrapAsyn(async (req, res) => {

    let { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(req.user);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New reveiw has created");

     res.redirect(`/listing/${id}`);

  
}));

//delete review
router.delete("/:reviewId",isLogedIn, wrapAsyn(async (req,res) => {
    
    let { id, reviewId } = req.params;

    let res1 = await Review.findByIdAndDelete(reviewId);
    console.log(res1);

    let res2 = await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    console.log(res2);
    req.flash("success", "Reveiw has Deleted");
    res.redirect(`/listing/${id}`);
}
));


module.exports = router;
