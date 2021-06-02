const Surfsite = require("../models/surfsite");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const surfsite = await Surfsite.findById(req.params.id);
    console.log(surfsite);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    surfsite.reviews.push(newReview);
    await surfsite.save();
    req.flash("success", "Review Added!");
    res.redirect(`/surfsites/${surfsite._id}`);
};


module.exports.deleteReview = async (req, res) => {
    const {id, review_id} = req.params;
    await Surfsite.findByIdAndUpdate(id, {$pull : {reviews : review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash("success", "Review Deleted!");
    res.redirect(`/surfsites/${id}`);
};