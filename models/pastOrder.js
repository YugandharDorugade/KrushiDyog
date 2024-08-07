const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pastOrderSchema = new Schema({
    username: {
        type: String,
        required: true // Ensure this is required
    },
    products: [{
        listingName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        }
    }],
    orderDate: {
        type: Date,
        default: Date.now // Default to current date
    },
    deliveryDate: {
        type: Date,
    }
});

module.exports = mongoose.model("PastOrder", pastOrderSchema);
