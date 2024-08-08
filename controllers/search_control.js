const Listing = require("../models/listing");
const User = require("../models/user");

module.exports.search = async (req, res) => {
    try {
        const { title, category } = req.query; 
        let query = {};

        // Build the query based on title and category if provided
        if (title) {
            query.title = { $regex: new RegExp(title, 'i') }; // Case-insensitive search
        }
        if (category) {
            query.categories = { $regex: new RegExp(category, 'i') }; // Match category
        }

        // Fetch the listings based on the constructed query
        let listings = await Listing.find(query).populate('owner');

        // Render the search results with the filtered listings
        return res.render("listings/searchresults", { listings, title, category  });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error"); // Handle errors properly
    }
};
