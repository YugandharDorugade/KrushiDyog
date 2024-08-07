// routes/listings_routes.js

const wrapAsync = require('../utils/wrapAsync'); 

const express = require("express");
const router = express.Router();

const {isLoggedIn,isOwner} =require("../middleware.js");
const listingController = require("../controllers/listing_control.js");
// img as file
const multer = require ('multer');
const {storage}= require("../cloudconfig.js");
const upload = multer({storage});



router.route("/")

.get( wrapAsync(listingController.index))

.post(
    isLoggedIn,

    upload.array("listing[images]"),
wrapAsync((listingController.createListing)));



// DISCLAIMER : postion of new must be at above /:id
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));



router.route("/:id")
.get(wrapAsync(listingController.showListing))


.put(
    isLoggedIn,
    isOwner,

    upload.array("listing[images]"),
    wrapAsync((listingController.updateListing)))


.delete(isLoggedIn,isOwner, wrapAsync((listingController.destroyListing))); 


router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync((listingController.renderEditForm)));



module.exports = router;
