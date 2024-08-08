const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
require('dotenv').config({ path: '../.env' }); // Load environment variables

const dburl = process.env.ATLASDB_URL;

async function main() {
  try {
    console.log("Database URL:", dburl); // Check the database URL
    await mongoose.connect(dburl);
    console.log("connected to DB");
  } catch (err) {
    console.log("Error connecting to the database", err);
  }
}

async function initDB() {
  try {
    await Listing.deleteMany({});
    console.log("Previous data deleted");

    await Listing.insertMany(initdata.data);
    console.log("data initialized");
  } catch (err) {
    console.log("Error initializing data", err);
  }
}

main().then(initDB);
