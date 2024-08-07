const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const wrapAsync = require('../utils/wrapAsync'); 
const cartcontroller = require("../controllers/cart_control.js");



router.get("/showcart" ,isLoggedIn,wrapAsync(cartcontroller.showcart));
router.post("/add", isLoggedIn, wrapAsync(cartcontroller.addToCart)); 
router.post("/remove", isLoggedIn, wrapAsync(cartcontroller.removeFromCart));
router.post("/addQuantity", isLoggedIn, wrapAsync(cartcontroller.addQuantity));
router.post("/confirm" ,isLoggedIn,wrapAsync(cartcontroller.confirmOrder));
router.post("/placeOrder", isLoggedIn, wrapAsync(cartcontroller.placeOrder));
router.post("/confirmCart" ,isLoggedIn,wrapAsync(cartcontroller.confirmCartOrder));
router.post("/placecart", isLoggedIn, wrapAsync(cartcontroller.placeCart));
router.post("/deletecart", isLoggedIn, wrapAsync(cartcontroller.deleteCart));
module.exports = router;
