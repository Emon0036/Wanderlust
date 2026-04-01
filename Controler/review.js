const Listing = require("../model/listing.js");
const Review = require("../model/review.js");

//addReview
module.exports.addReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
   // console.log(req.user);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New reveiw has created");

     res.redirect(`/listing/${id}`);

  
};

//delete review 
module.exports.deleteRv = async (req,res) => {
    
    let { id, reviewId } = req.params;

    let res1 = await Review.findByIdAndDelete(reviewId);
    console.log(res1);

    let res2 = await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    console.log(res2);
    req.flash("success", "Reveiw has Deleted");
    res.redirect(`/listing/${id}`);
};