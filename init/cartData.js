const cartData = [
    {
        userId: "669bc36f868c70cf624931e0", // First user ID
        items: [
            {
                listingId: "66b25c754009a4df0d32e67b", // Product 1 (replace with actual ObjectId)
                quantity: 2,
                price: 499, // Price of Product 1 (Ghansal)
                totalPrice: 998 // Total price for Product 1 (2 * 499)
            },
            {
                listingId: "66b25c754009a4df0d32e680", // Product 2 (replace with actual ObjectId)
                quantity: 1,
                price: 499, // Price of Product 2 (Jiraga)
                totalPrice: 499 // Total price for Product 2 (1 * 499)
            }
        ],
        grandTotal: 1497 // Calculated grand total (998 + 499)
    },
    {
        userId: "669e474ba0a05e0bb4b15e96", // Second user ID
        items: [
            {
                listingId: "66b25c754009a4df0d32e685", // Product 1 (replace with actual ObjectId)
                quantity: 1,
                price: 499, // Price of Product 1 (Ghansal)
                totalPrice: 499 // Total price for Product 1 (1 * 499)
            },
            {
                listingId: "66b25c754009a4df0d32e68a", // Product 2 (replace with actual ObjectId)
                quantity: 2,
                price: 499, // Price of Product 2 (Jiraga)
                totalPrice: 998 // Total price for Product 2 (2 * 499)
            }
        ],
        grandTotal: 1497 // Calculated grand total (499 + 998)
    }
];

module.exports = { data: cartData };
