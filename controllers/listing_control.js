const Listing = require("../models/listing");



module.exports.index =async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm =async(req, res) => {

    res.render("listings/new.ejs");
};

module.exports.showListing =async (req, res) => {
    const { id } = req.params;

        const listing = await Listing.findById(id)
        .populate(
            {
                path :"reviews",
                populate :{
                    path :"author",
                },
            })
        .populate("owner");
        if (!listing) {
            req.flash("error", "Product is out of stock!");
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });

};

// module.exports.createListing = async (req, res) => {
//     const imageUrls = req.files.map(file => ({
//         url: file.path,
//         filename: file.filename
//     }));
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.images = imageUrls; // Store multiple images
//     await newListing.save();
//     req.flash("success", "New product added!");
//     res.redirect("/listings");
// };

module.exports.createListing = async (req, res) => {
    const imageUrls = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }));
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.images = imageUrls; // Store multiple images
    
    // Save categories as an array
    newListing.categories = req.body.listing.categories; // This will be an array from the checkboxes

    await newListing.save();
    req.flash("success", "New product added!");
    res.redirect("/listings");
};


module.exports.renderEditForm =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","product is not avilable");
        res.redirect("/listings");
    }

    

    res.render("listings/edit.ejs" ,{listing});

};




module.exports.destroyListing =async (req, res) => {

    const productId = req.params.id;
    const result = await Listing.findByIdAndDelete(productId);
    if (result) {
        res.redirect('/listings'); // Redirect after deletion
    } else {
        res.redirect('/listings'); // Redirect if not found
    }

};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const deleteImageIds = req.body.deleteImages || []; // Get IDs of images to delete

    try {
        // Find the listing
        let listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Product not found!");
            return res.redirect("/listings");
        }

        // Update product details
        await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

        // Remove images specified for deletion
        if (deleteImageIds.length > 0) {
            listing.images = listing.images.filter(image => !deleteImageIds.includes(image._id.toString()));
        }

        // Initialize an array for new images
        let newImages = [];

        // Add new images from req.files
        if (req.files && req.files.length > 0) {
            newImages = req.files.map(file => ({
                url: file.path,
                filename: file.filename
            }));
        }

        // Combine existing images with new images
        listing.images = [...listing.images, ...newImages];

        // Save the updated listing
        await listing.save();

        req.flash("success", "Changes saved successfully");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error);
        req.flash("error", "An error occurred while updating the listing.");
        res.redirect(`/listings/${id}`);
    }
};
