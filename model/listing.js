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
       type: String,
       default:"https://img.freepik.com/free-photo/cascade-boat-clean-china-natural-rural_1417-1356.jpg?t=st=1770976298~exp=1770979898~hmac=2b897eaf14ef6ebb11b34f9b0ed06987f6565a9db8674dcc8e9e50b9b9c223c4&w=1060 ",

       set:(v)=> v===""?"https://img.freepik.com/free-photo/cascade-boat-clean-china-natural-rural_1417-1356.jpg?t=st=1770976298~exp=1770979898~hmac=2b897eaf14ef6ebb11b34f9b0ed06987f6565a9db8674dcc8e9e50b9b9c223c4&w=1060 " : v,
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