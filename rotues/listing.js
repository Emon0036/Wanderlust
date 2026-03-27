const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsyn = require("../Utility/wrapAsyn.js");
const customError = require("../Utility/expressError.js");
const Listing = require("../model/listing.js");
const { isLogedIn, isOwner, validateListing, validateListingUpdate } = require("../isLogedin.js");
const controler = require("../Controler/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfigure.js");
const upload = multer({storage});

const attachUploadedImageToBody = (req, res, next) => {
    if (req.file) {
        if (!req.body.list) req.body.list = {};
        req.body.list.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }
    next();
};




//Index route
router.get("/", wrapAsyn(controler.index));
 
 

//new route
router.get("/new",isLogedIn,(req,res)=>{

    res.render("addnew.ejs");

});

//show route
router.get("/:id", wrapAsyn(controler.showRoute));


//add new route
router.post(
    "/",
    isLogedIn,
    upload.single("listingImage"),
    attachUploadedImageToBody,
    validateListing,
    wrapAsyn(controler.addNew)
);


//update route
router.get("/:id/edit", isLogedIn, isOwner, wrapAsyn(controler.update));

//put route
router.put(
    "/:id",
    isLogedIn,
    isOwner,
    upload.single("listingImage"),
    attachUploadedImageToBody,
    validateListingUpdate,
    wrapAsyn(controler.putRoute)
);


//destroy route
router.delete("/:id",isLogedIn,isOwner,wrapAsyn(controler.destroyRoute));


module.exports = router;

