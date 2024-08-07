const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        listingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        totalPrice: { // Total price for this item
            type: Number,
            default: function() {
                return this.quantity * this.price;
            }
        }
    }],
    grandTotal: { // Total cost including any additional charges
        type: Number,
        default: 0
    }
});

// Middleware to calculate grandTotal before saving
cartSchema.pre('save', function(next) {
    // Calculate grandTotal based on totalPrice of all items
    this.grandTotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
