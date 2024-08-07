const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const wrapAsync = require('../utils/wrapAsync'); 
const wishlistcontroller = require("../controllers/wishlist_control.js");


router.get("/showwishlist",isLoggedIn,wrapAsync(wishlistcontroller.displaywishlist));
router.post("/add", isLoggedIn,wrapAsync(wishlistcontroller.addtowishlist));
router.post("/remove", isLoggedIn,wrapAsync(wishlistcontroller.removefromwishlist));

module.exports = router;
