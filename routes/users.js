const express = require("express");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

const router = express.Router();

router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser));

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/users/login" }), catchAsync(users.loginUser));

router.get("/logout", users.logout);

module.exports = router;