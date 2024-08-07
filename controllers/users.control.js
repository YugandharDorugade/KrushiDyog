const User = require("../models/user");
const PastOrder = require("../models/pastOrder"); // Assuming you have a PastOrder model
const Wishlist = require("../models/wishlist"); // Assuming you have a Wishlist model
const Cart = require("../models/cart"); // Assuming you have a Cart model
const Listing = require("../models/listing");


module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    let { username, email, password } = req.body;
    try {
        const newUser = new User({ email, username });
        const ruser = await User.register(newUser, password);
        req.login(ruser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "logged in");
            res.redirect("/listings");
        });
    } catch (err) {
        next(err);
    }
};

module.exports.renderloginform = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "welcome");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged out");
        res.redirect("/listings");
    });
};

module.exports.profile = async (req, res) => {
    try {
        const userId = req.user._id; // Use user ID from req.user

        const pastOrders = await PastOrder.find({ username: req.user.username });

        // Find the wishlist for the user
        const wishlist = await Wishlist.findOne({ user: userId }).populate('products.product');
        const cart = await Cart.findOne({ userId }).populate('items.listingId');

        // Handle wishlist
        let availableWishlistProducts = [];
        if (wishlist) {
            // Check for available products in the listings database
            for (const item of wishlist.products) {
                const existingProduct = await Listing.findById(item.product);
                if (existingProduct) {
                    availableWishlistProducts.push(item); // Store available products
                }
            }
            // Update wishlist with available products
            wishlist.products = availableWishlistProducts;
            await wishlist.save();
        }

        // Handle empty wishlist
        if (!wishlist || !wishlist.products.length) {
            req.flash("info", "Your wishlist is empty.");
        }

        // Handle cart
        let availableCartItems = [];
        if (cart) {
            // Check for unavailable listings and remove them from the cart
            for (const item of cart.items) {
                // Ensure item.listingId is valid before querying
                if (item.listingId && item.listingId._id) {
                    const listing = await Listing.findById(item.listingId._id);
                    if (listing) {
                        availableCartItems.push(item);
                    }
                }
            }
            // Update the cart with available items
            cart.items = availableCartItems;
            cart.grandTotal = availableCartItems.reduce((sum, item) => sum + item.totalPrice, 0);
            await cart.save();
        }

        // Handle empty cart message
        if (!cart || !cart.items.length) {
            req.flash("info", "Your cart is empty.");
        }

        res.render("users/profile.ejs", { 
            user: req.user, 
            pastOrders,  
            wishlist,
            cart 
        });

    } catch (err) {
        console.error(err);
        req.flash("error", "Could not load profile data.");
        res.redirect("/listings");
    }
};


