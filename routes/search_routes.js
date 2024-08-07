const express = require("express");
const router = express.Router();
const searchcontroller = require("../controllers/search_control");
const wrapAsync = require("../utils/wrapAsync");

router.get("/", wrapAsync(async (req, res) => {
    // Use the unified search function from the controller
    await searchcontroller.search(req, res);
}));

module.exports = router;
