const express = require("express");
const router = express.Router({mergeParams:true});
const { listingSchema, reviewSchema } = require("../Schema.js");
const Review = require("../model/review.js");
const wrapAsyn = require("../Utility/wrapAsyn.js");
const Listing = require("../model/listing.js");
const customError = require("../Utility/expressError.js");
const {isLogedIn,validateReview} = require("../isLogedin.js");
const controler = require("../Controler/review.js");



//review section
router.post("/", isLogedIn, validateReview, wrapAsyn(controler.addReview));

//delete review
router.delete("/:reviewId",isLogedIn, wrapAsyn(controler.deleteRv));


module.exports = router;
