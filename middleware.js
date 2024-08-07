// middleware.js
const Listing = require("./models/listing");
const Review = require("./models/review");


const { listingSchema, reviewSchema } = require("./Schema.js");



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "please login");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.curruser._id)) {
        req.flash("error", "access denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isreviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.curruser._id)) {
        req.flash("error", "access denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateproduct = async (req, res, next) => {
    const { error } = listingSchema.validate(req.body.listing);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      return res.status(400).json({ error: msg });
    } else {
      next();
    }
  };

  module.exports.validatereviews =async (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.review);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      return res.status(400).json({ error: msg });
    } else {
      next();
    }
  };
