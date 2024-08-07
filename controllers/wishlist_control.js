
const Wishlist = require("../models/wishlist"); // Assuming you have a Wishlist model

const Listing = require("../models/listing");

module.exports.displaywishlist = async (req, res) => {
    try {
        const userId = req.user._id; 

        // Find the wishlist for the user
        const wishlist = await Wishlist.findOne({ user: userId }).populate('products.product');

        // Check if the wishlist is not found or if the products array is empty
        if (!wishlist || !wishlist.products.length) {
            req.flash("error", "Your wishlist is empty.");
            return res.redirect("/profile"); // Redirect to the profile or desired page without rendering a response
        }

        const availableProducts = [];

        // Check for available products in the listings database
        for (const item of wishlist.products) {
            const existingProduct = await Listing.findById(item.product);
            if (existingProduct) {
                availableProducts.push(item); // Store available products
            } else {
                // If the product doesn't exist in listings, it's already handled by not pushing to availableProducts
                // Optionally, you could remove it from the wishlist here if you want to
            }
        }

        // Update the wishlist with available products
        wishlist.products = availableProducts;
        await wishlist.save();

        // Render the wishlist with available products
        res.render("users/wishlist.ejs", { 
            user: req.user, 
            wishlist
        });

    } catch (err) {
        console.error(err);
        req.flash("error", "Could not load wishlist data.");
        res.redirect("/listings");
    }
};


module.exports.addtowishlist = async (req, res) => {
    const userId = req.user._id;
    const { listingId } = req.body;

    try {
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: userId,
                products: [{ product: listingId }]
            });

            await wishlist.save();
            req.flash("success", "Item added to wishlist!");
            return res.redirect("/profile");
        }

        const itemExists = wishlist.products.some(item => item.product.toString() === listingId);

        if (itemExists) {
            req.flash("error", "Item is already in your wishlist.");
            return res.redirect("/profile");
        }

        wishlist.products.push({ product: listingId });
        await wishlist.save();

        req.flash("success", "Item added to wishlist!");
        res.redirect("/profile");
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not add item to wishlist. Please try again.");
        res.redirect("/profile");
    }
};

module.exports.removefromwishlist = async (req, res) => {
    const userId = req.user._id;
    const { listingId } = req.body;
    const wishlist = await Wishlist.findOne({ user: userId });

    if (wishlist) {
        const itemIndex = wishlist.products.findIndex(item => item.product.toString() === listingId);

        if (itemIndex !== -1) {
            wishlist.products.splice(itemIndex, 1);
            await wishlist.save();
            req.flash("success", "Item removed from wishlist!");
        } else {
            req.flash("error", "Item not found in wishlist.");
        }
    } else {
        req.flash("error", "Wishlist not found.");
    }

    res.redirect("/profile");
};
