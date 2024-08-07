const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const wrapAsync = require('../utils/wrapAsync'); 
const usercontroller = require("../controllers/users.control.js");

// User signup routes
router.route("/signup")
    .get(usercontroller.renderSignUpForm)
    .post(wrapAsync(usercontroller.signup));

// User login routes
router.route("/login")
    .get(usercontroller.renderloginform)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        usercontroller.login
    );

// User logout route
router.get("/logout", usercontroller.logout);

// User profile route
router.get("/profile", isLoggedIn, wrapAsync(usercontroller.profile));

// User past orders route
router.get("/pastorders", isLoggedIn, wrapAsync(usercontroller.pastorder));


module.exports = router;
