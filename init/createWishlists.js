const mongoose = require("mongoose");
const initData = require("./wishlistData.js"); // Importing sample data
const Wishlist = require("../models/wishlist.js"); // Importing the Wishlist model


const dburl = process.env.ATLASDB_URL;



async function main() {
  try {
    await mongoose.connect(dburl);
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to the database", err);
  }
}

async function initWishlistDB() {
  try {
    await Wishlist.deleteMany({});
    console.log("Previous Wishlist data deleted");

    await Wishlist.insertMany(initData.data);
    console.log("Wishlist data initialized");
  } catch (err) {
    console.log("Error initializing Wishlist data", err);
  }
}

main().then(initWishlistDB);
