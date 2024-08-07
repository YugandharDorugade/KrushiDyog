// app.js
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();

}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require('express-session');
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require('./utils/wrapAsync');

const app = express();

const dburl = process.env.ATLASDB_URL;

// Connect to MongoDB
mongoose.connect(dburl)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

// App Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl :dburl,
    crypto :{
        secret :process.env.SECRET,
    },
    // session restart after 1 day 
    touchAfter :24*3600,
});

store.on("error" ,()=>{
    console.log("error occurred in mongo session store",err);
})
// Express session setup
app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));    

app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Local variables middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
});

// EJS Layouts
app.engine("ejs", ejsMate);


// Import routers
const searchRouter = require("./routes/search_routes");
const listingsRouter = require("./routes/listing_routes");
const reviewsRouter = require("./routes/review_routes");
const userRouter = require("./routes/user_signup");
const cartRouter = require("./routes/cart_routes");
const wishlistRouter = require("./routes/wishlist_routes");
const { error } = require('console');


// Use routers
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
app.use("/search",searchRouter);
app.use("/cart",cartRouter);
app.use("/wishlist",wishlistRouter);

app.get("/home" ,(req,res)=>{

    res.render("listings/home" ,{Listing});
});
// Home route
app.get("/root", (req, res) => {
    res.send("Welcome To KrushiDyog");
});
// 404 Page Not Found
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { statuscode = 500, message = "Something went wrong!" } = err;
    res.status(statuscode).render("error", { err });
});

// Home route
app.get("/", (req, res) => {
    res.send("Welcome To KrushiDyog");
});



// Start server
app.listen(8080, () => {
    console.log("App is listening on port 8080");
});
