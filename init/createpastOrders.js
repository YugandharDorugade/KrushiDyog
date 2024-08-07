const mongoose = require("mongoose");
const initData = require("./pastOrderData.js");
const PastOrder = require("../models/pastOrder.js");



const dburl = process.env.ATLASDB_URL;



async function main() {
  try {
    await mongoose.connect(dburl);
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to the database", err);
  }
}

async function initPastOrderDB() {
  try {
    await PastOrder.deleteMany({});
    console.log("Previous PastOrder data deleted");

    await PastOrder.insertMany(initData.data);
    console.log("PastOrder data initialized");
  } catch (err) {
    console.log("Error initializing PastOrder data", err);
  }
}

main().then(initPastOrderDB);
