const Review = require("./models/review");
const Surfsite = require("./models/surfsite");
const {surfsiteSchema, reviewSchema} = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be loggen in!");
        return res.redirect("/users/login");
    }
    next();
};

module.exports.validateSurfsite = (req, res, next) => {
    const result = surfsiteSchema.validate(req.body);
    if(result.error) {
        const msg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if(result.error) {
        const msg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.verifyAuthor = async (req, res, next) => {
    const { id } = req.params;
    const surfsite = await Surfsite.findById(id);
    if (!surfsite.author.equals(req.user._id)) {
        req.flash("error", "Unauthorized action!");
        return res.redirect(`/surfsites/${surfsite._id}`);
    }
  ;  next();
}

module.exports.verifyReviewAuthor = async (req, res, next) => {
    const { id, review_id } = req.params;
    const review = await Review.findById(review_id);
    console.log(review, review_id);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "Unauthorized action!");
        return res.redirect(`/surfsites/${id}`);
    }
  ;  next();
}