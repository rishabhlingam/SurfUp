const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash("success", "logged Out!");
    res.redirect("/surfsites");
};

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.logIn(registeredUser, err => {
            if(err) {
                req.flash("success", "Welcome");
                res.redirect("/surfsites");
                return next(err);
            }
        });
        res.redirect("/surfsites");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/users/register");
    }
};

module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/surfsites";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};