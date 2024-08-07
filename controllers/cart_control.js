const User = require("../models/user");
const PastOrder = require("../models/pastOrder"); // Assuming you have a PastOrder model
const Wishlist = require("../models/wishlist"); // Assuming you have a Wishlist model
const Cart = require("../models/cart"); // Assuming you have a Cart model
const Listing = require("../models/listing");

module.exports.showcart = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the cart for the user
        const cart = await Cart.findOne({ userId }).populate('items.listingId');

        // Check for unavailable listings and remove them from the cart
        if (cart) {
            const availableItems = [];

            for (const item of cart.items) {
                // Ensure item.listingId is valid before querying
                if (item.listingId && item.listingId._id) {
                    const listing = await Listing.findById(item.listingId._id);
                    if (listing) {
                        availableItems.push(item);
                    }
                }
            }

            // Update the cart with available items
            cart.items = availableItems;
            cart.grandTotal = availableItems.reduce((sum, item) => sum + item.totalPrice, 0);
            await cart.save();
        }

        res.render("users/cart.ejs", { 
            user: req.user, 
            cart 
        });

    } catch (err) {
        console.error(err);
        req.flash("error", "Could not load cart data.");
        res.redirect("/listings");
    }
};


module.exports.addToCart = async (req, res) => {
    const { listingId } = req.body;
    const userId = req.user._id;

    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/profile");
        }

        let cart = await Cart.findOne({ userId }) || new Cart({ userId, items: [], grandTotal: 0 });

        const existingItem = cart.items.find(item => item.listingId.toString() === listingId);
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.totalPrice = existingItem.price * existingItem.quantity;
        } else {
            cart.items.push({
                listingId,
                quantity: 1,
                price: listing.price,
                totalPrice: listing.price
            });
        }

        cart.grandTotal = cart.items.reduce((total, item) => total + item.totalPrice, 0);
        await cart.save();

        req.flash("success", existingItem ? "Item quantity updated in cart." : "Item added to cart!");
        res.redirect("/profile");
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not add item to cart.");
        res.redirect("/profile");
    }
};



module.exports.removeFromCart = async (req, res) => {
    const userId = req.user._id; // Get the user ID from the authenticated user
    const { listingId } = req.body; // Get the listing ID from the request body

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            req.flash("error", "Cart not found.");
            return res.redirect("/cart"); // Redirect to the cart page
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(item => item.listingId.toString() === listingId);
        if (itemIndex === -1) {
            req.flash("error", "Item not found in the cart.");
            return res.redirect("/cart"); // Redirect to the cart page
        }

        // Update the grandTotal
        const itemToRemove = cart.items[itemIndex];
        cart.grandTotal -= itemToRemove.totalPrice; // Deduct the total price of the item

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);

        // Save the updated cart
        await cart.save();

        req.flash("success", "Item removed from cart.");
        res.redirect("/profile"); // Redirect to the cart page
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not remove item from cart.");
        res.redirect("/cart"); // Redirect to the cart page
    }
};


module.exports.addQuantity = async (req, res) => {
    const userId = req.user._id; // Get the user ID from the authenticated user
    const { listingId, quantity } = req.body; // Get the listing ID and new quantity from the request body

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            req.flash("error", "Cart not found.");
            return res.redirect("/profile"); // Redirect to the cart page
        }

        // Find the item in the cart
        const item = cart.items.find(item => item.listingId.toString() === listingId);
        if (!item) {
            req.flash("error", "Item not found in the cart.");
            return res.redirect("/profile"); // Redirect to the cart page
        }

        // Get the current price of the listing
        const listing = await Listing.findById(listingId);
        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/profile"); // Redirect to the cart page
        }

        // Update the quantity and total price
        const previousQuantity = item.quantity;
        item.quantity = quantity; // Update the quantity from the form
        item.totalPrice = listing.price * quantity; // Update total price based on new quantity

        // Update grandTotal
        cart.grandTotal += item.totalPrice - (listing.price * previousQuantity); // Adjust grand total

        // Save the updated cart
        await cart.save();

        req.flash("success", "Item quantity updated in cart.");
        res.redirect("/profile"); // Redirect to the cart page
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not update item quantity in cart.");
        res.redirect("/profile"); // Redirect to the cart page
    }
};

module.exports.confirmOrder = async (req, res) => {
    const {listingId} = req.body;
    try {
        const userId = req.user._id; // Get user ID from the request object
        // Find the cart of the user and populate listingId
        const cart = await Cart.findOne({ userId }).populate('items.listingId');

        // Find the specific item in the cart
        const item = cart.items.find(item => item.listingId._id.toString() === listingId);

        if (!item) {
            req.flash("error", "Item not found in cart.");
            return res.redirect("/profile"); // Redirect if item isn't found
        }

        // Render the place order page with the item details
        res.render("users/placeorder.ejs", { 
            user: req.user, 
            item: item.listingId, // Send listing details to the view
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice,
        });

    } catch (err) {
        console.error(err);
        req.flash("error", "Could not retrieve product details. Please try again.");
        res.redirect("/profile"); // Redirect to the cart page on error
    }
};

module.exports.placeOrder = async (req, res) => {
    const userId = req.user._id; // Get the user ID from the authenticated user
    const { listingId } = req.body; // Get the listing ID from the request body

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            req.flash("error", "Cart is empty. Cannot place order.");
            return res.redirect("/profile"); // Redirect to the profile page
        }

        // Find the specific item in the cart
        const itemIndex = cart.items.findIndex(item => item.listingId.toString() === listingId);
        if (itemIndex === -1) {
            req.flash("error", "Item not found in cart.");
            return res.redirect("/profile"); // Redirect to the cart page
        }

        // Get the item details and remove it from the cart
        const item = cart.items[itemIndex];
        const listing = await Listing.findById(listingId);
        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/profile"); // Redirect to the cart page
        }

        // Prepare the past order product
        const product = {
            listingName: listing.title, // Use the title from the listing
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice
        };

        // Create a new past order for the single item
        const newOrder = new PastOrder({
            username: req.user.username, // Get username from the user object
            products: [product], // Wrap in an array
            orderDate: Date.now(), // Set the order date
            deliveryDate: Date.now() // Set the delivery date (you can modify this later if needed)
        });

        // Save the new order to the database
        await newOrder.save();

        // Update the grand total of the cart
        cart.grandTotal -= item.totalPrice; // Deduct the item's total price from the grand total
        cart.items.splice(itemIndex, 1); // Remove the item from the cart

        // If the cart is empty, delete it; otherwise, save the updated cart
        if (cart.items.length === 0) {
            await Cart.deleteOne({ userId });
        } else {
            await cart.save(); // Save the updated cart
        }

        req.flash("success", "Order placed successfully for the item!");
        res.redirect("/profile"); // Redirect to the past orders page
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not place order. Please try again.");
        res.redirect("/profile"); // Redirect to the cart page
    }
};

module.exports.confirmCartOrder = async (req, res) => {
    try {
        const userId = req.user._id; // Use user ID from req.user


        const cart = await Cart.findOne({ userId }).populate('items.listingId');

        res.render("users/placecart.ejs", { 
            user: req.user, 


            cart 
        });

    } catch (err) {
        console.error(err);
        req.flash("error", "Could not load profile data.");
        res.redirect("/listings");
    }
};

module.exports.placeCart = async (req, res) => {
    const userId = req.user._id; // Get the user ID from the authenticated user

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            req.flash("error", "Cart is empty. Cannot place order.");
            return res.redirect("/profile"); // Redirect to the profile page
        }

        // Iterate through each item in the cart
        for (const item of cart.items) {
            const listing = await Listing.findById(item.listingId);
            if (!listing) {
                req.flash("error", "One or more listings not found.");
                return res.redirect("/profile"); // Redirect to the profile page
            }

            // Prepare the product details
            const product = {
                listingName: listing.title, // Use the title from the listing
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.totalPrice
            };

            // Create a new past order for the single item
            const newOrder = new PastOrder({
                username: req.user.username, // Get username from the user object
                products: [product], // Wrap in an array to maintain the existing model structure
                orderDate: Date.now(), // Set the order date
                deliveryDate: Date.now() // Set the delivery date (you can modify this later if needed)
            });

            // Save the new order to the database
            await newOrder.save();
        }

        // Empty the cart
        await Cart.deleteOne({ userId });

        req.flash("success", "Orders placed successfully for all items in the cart!");
        res.redirect("/profile"); // Redirect to the past orders page
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not place orders. Please try again.");
        res.redirect("/profile"); // Redirect to the cart page
    }
};

module.exports.deleteCart = async (req, res) => {
    const userId = req.user._id; // Get the user ID from the authenticated user

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            req.flash("error", "Cart not found.");
            return res.redirect("/profile"); // Redirect to the cart page
        }

        // Clear the items from the cart
        cart.items = [];
        cart.grandTotal = 0; // Set grand total to zero

        // Save the updated cart
        await cart.save();

        req.flash("success", "All items removed from the cart.");
        res.redirect("/profile"); // Redirect to the cart page
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not delete items from cart. Please try again.");
        res.redirect("/profile"); // Redirect to the cart page
    }
};
