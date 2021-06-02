const express = require("express");
const catchAsync = require("../utils/catchAsync");
const surfsites = require("../controllers/surfsites");
const { isLoggedIn, validateSurfsite, verifyAuthor } = require("../middleware");
var multer  = require('multer')
const {storage} = require("../cloudinary");
var upload = multer({ storage })

const router = express.Router();

router.route("/")
    .get( catchAsync(surfsites.index))
    .post(isLoggedIn , upload.array("surfsite[image]"), validateSurfsite, catchAsync(surfsites.createNewSurfsite));

router.get("/new", isLoggedIn, catchAsync(surfsites.renderNewForm));

router.route("/:id")
    .get( catchAsync(surfsites.showSurfsite))
    .patch( isLoggedIn, verifyAuthor,  upload.array("surfsite[image]"), validateSurfsite, catchAsync(surfsites.updateSurfsite))
    .delete( isLoggedIn, verifyAuthor, catchAsync(surfsites.deletesSurfsite));

router.get("/:id/edit", isLoggedIn, verifyAuthor, catchAsync(surfsites.renderEditForm));

module.exports = router;