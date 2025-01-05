const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const review=require("./review.js");

const listingSchema= new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/the-people-relaxing-on-santa-monica-state-beach-in-california-usa-u1FWmL-gtpo",
        set: (v)=>v===""?"https://unsplash.com/photos/the-people-relaxing-on-santa-monica-state-beach-in-california-usa-u1FWmL-gtpo" :v,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await review.deleteMany({id: {$in: listing.reviews}});
    }
});

const Listing= mongoose.model("Listing", listingSchema);
module.exports= Listing;