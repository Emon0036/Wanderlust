const Listing = require("../model/listing.js");
const customError = require("../Utility/expressError.js");
const { geocodeLocation } = require("../Utility/geocode.js");

module.exports.index = async (req, res) => {

    let allData = await Listing.find({});
    res.render("index.ejs", { allData }); 
    
};


//show route 
module.exports.showRoute = async (req, res) => {
    let {id} = req.params;
    const info = await Listing.findById(id)
        .populate({ path: "review", populate: { path: "author" } })
        .populate("owner");

    if (!info)
    {
        req.flash("error", "That image you have searched for that doesn't exsit!");
        res.redirect("/listing");
    }
    else {
       // console.log(info);
        res.render("show.ejs",{info});
    }

    
};

//add New route
module.exports.addNew = async (req, res) => {

    if (!req.file) {
        throw new customError(400, "Image upload is required (field name must match Multer config).");
    }

    let url= req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.list);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    const geo = await geocodeLocation(`${newListing.location}, ${newListing.country}`);
    if (geo) {
        newListing.geometry = { type: "Point", coordinates: [geo.lng, geo.lat] };
    }
    await newListing.save();

    req.flash("success", "You have created new listing");
    res.redirect(`/listing/${newListing._id}`);
};

//update route
module.exports.update = async (req, res) => {
    let {id} = req.params;
    let allinfo = await Listing.findById(id);
    if (!allinfo)
    {
        req.flash("error", "That image you have searched for that doesn't exsit!");
        res.redirect("/listing");
    }
    else {
    res.render("update.ejs",{allinfo});
    }
 
};


//put route
module.exports.putRoute = async (req, res, next) => {
    let {id} = req.params;

    const info = await Listing.findById(id);
    if (!info) {
        req.flash("error", "That image you have searched for that doesn't exsit!");
        return res.redirect("/listing");
    }

    const prevLocation = info.location;
    const prevCountry = info.country;

    info.set(req.body.list);

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        info.image = { url, filename };
    }

    const locationChanged = prevLocation !== info.location || prevCountry !== info.country;
    if (locationChanged) {
        const geo = await geocodeLocation(`${info.location}, ${info.country}`);
        if (geo) {
            info.geometry = { type: "Point", coordinates: [geo.lng, geo.lat] };
        } else {
            info.geometry = undefined;
        }
    }

    await info.save();

    req.flash("success", "Updated sucessful");
    res.redirect(`/listing/${id}`);
   
};


//destroy route
module.exports.destroyRoute = async (req, res) => {
  if (!req.params)
    {
        throw new customError(400, "send valid data for listing");
    }

     let {id} = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listing");
};
