const mongoose = require("mongoose");
const initData = require("./cartData"); // Adjust the path to your cart data file
const Cart = require("../models/cart"); // Adjust the path to your cart model


const dburl = process.env.ATLASDB_URL;



async function main() {
  try {
    await mongoose.connect(dburl);
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to the database", err);
  }
}

async function initDB() {
  try {
    // Delete any existing cart data
    await Cart.deleteMany({});
    console.log("Previous cart data deleted");

    // Insert the new cart data
    await Cart.insertMany(initData.data);
    console.log("Cart data initialized");
  } catch (err) {
    console.log("Error initializing cart data", err);
  }
}

// Run the main function and initialize the database
main().then(initDB);
