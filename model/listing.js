const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = Schema({
  
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
       url:String,
       filename:String,
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number], // [lng, lat]
        },
    },
    price:Number,
    location:String,
    country: String,
    review:
    [
     {
        type: Schema.Types.ObjectId,
        ref:"review",
     }
    ],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

});


listingSchema.post("findOneAndDelete", async (listing) => {
    
    await Review.deleteMany({ _id: { $in: listing.review } });
});


const Listing = mongoose.model("Listing",listingSchema);

module.exports=Listing;
