const express = require("express");
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");
const {isLoggedIn, validateReview, verifyReviewAuthor} = require("../middleware");

const router = express.Router({mergeParams : true});

router.post("/", isLoggedIn, validateReview, catchAsync( reviews.createReview ));

router.delete("/:review_id", isLoggedIn, verifyReviewAuthor, catchAsync( reviews.deleteReview ));

module.exports = router;