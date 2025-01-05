const express=require("express");
const router=express.Router();
const Listing= require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema}=require("../schema.js")
const {isLoggedIn}=require("../middleware.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}


//index route
router.get("/", validateListing, wrapAsync( async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});

})
);

//new route
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs");
});

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync( async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
})
);


//show route
router.get("/:id", wrapAsync( async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
})
);

//create route
router.post("", isLoggedIn, validateListing, wrapAsync( async(req,res, next)=>{
        //let listing=req.body.listing;
        const newListing= new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");  
})
);

//update route
router.put("/:id", isLoggedIn, validateListing, wrapAsync( async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
})
);

//delete route
router.delete("/:id", isLoggedIn, wrapAsync( async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
})
);

module.exports=router;