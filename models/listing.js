const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        url: String,
        filename: String
    }],
    origin: {
        type: String,
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    categories: [{
        type: String,
        enum: [
            'Grains', 
            'Spices', 
            'Dairy', 
            'Organic Cosmetics', 
            'Fruits', 
            'Vegetables', 
            'Trending', 
            'Seasonal', 
            'Organic', 
            'Cooking', 
            'Other'
        ],
        required: true
    }]
});

// if product deleted reviews of product will also delete 
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
