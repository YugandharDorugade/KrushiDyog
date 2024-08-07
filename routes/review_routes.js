const express = require("express");
const router = express.Router({ mergeParams: true });
const {isLoggedIn,isreviewAuthor,validateReview} =require("../middleware.js");
const reviewController = require("../controllers/reviews_control.js");
const wrapAsync = require("../utils/wrapAsync.js");



// Create a review
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));

// Delete a review
router.delete("/:reviewId", isLoggedIn,isreviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
