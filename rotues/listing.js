const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsyn = require("../Utility/wrapAsyn.js");
const customError = require("../Utility/expressError.js");
const { listingSchema, reviewSchema } = require("../Schema.js");
const Listing = require("../model/listing.js");
const {isLogedIn} = require("../isLogedin.js");

//Schema validate middleware
const validateListing = (req, res, next) => {
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


//Index route
router.get("/", wrapAsyn(async (req, res) => {

    let allData = await Listing.find({});
    res.render("index.ejs", { allData }); 
    
}));
 
 

//new route
router.get("/new",isLogedIn,(req,res)=>{

    res.render("addnew.ejs");

});

//show route
router.get("/:id", wrapAsyn(async (req, res) => {
    let {id} = req.params;
    const info = await Listing.findById(id).populate("review");
    if (!info)
    {
        req.flash("error", "That image you have searched for that doesn't exsit!");
        res.redirect("/listing");
    }
    else {
        res.render("show.ejs",{info});
    }
    
}));


//add new route
router.post("/", isLogedIn,validateListing ,wrapAsyn(async (req, res) => {
   
    let newListing = new Listing(req.body.list);
    await newListing.save();
    req.flash("success", "You have created new listing");
    res.redirect("/listing");
}));


//update route
router.get("/:id/edit",isLogedIn,wrapAsyn(async (req, res) => {
    let {id} = req.params;
    let allinfo = await Listing.findById(id);
    if (!allinfo)
    {
        req.flash("error", "That image you have searched for that doesn't exsit!");
        res.redirect("/listing");
    }
    else {
    req.flash("success", "Updated sucessful");
    res.render("update.ejs",{allinfo});
    }
 
}));

//put route
router.put("/:id",validateListing,isLogedIn, wrapAsyn(async (req, res, next) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.list });

    res.redirect(`/listing/${id}`);
   
}));


//destroy route
router.delete("/:id",isLogedIn,wrapAsyn(async (req, res) => {
  if (!req.params)
    {
        throw new customError(400, "send valid data for listing");
    }

     let {id} = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listing");
}));


module.exports = router;

