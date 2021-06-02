if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocal = require("passport-local");
const helmet = require("helmet");
const User = require("./models/user");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const {surfsiteSchema, reviewSchema} = require("./schemas.js");
const mongoSanitize = require("express-mongo-sanitize");
const MongoDBStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/surf-up";
mongoose.connect(dbUrl, {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true,
    useFindAndModify : false
});
mongoose.connection.on("error", console.error.bind(console, "database connection error:"));
mongoose.connection.once("open", () => {
    console.log("database connected");
});

const app = express();

app.use(mongoSanitize());
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const secret = process.env.SECRET || "anakinskywalker";
const store = new MongoDBStore({
    mongoUrl : dbUrl,
    secret,
    touchAfter : 24 * 60 * 60
});
store.on("error", function (e) {
    console.log("Store rror!", e);
});

const sessionConfig = {
    store,
    name : "session",
    secret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

const surfsiteRoutes = require("./routes/surfsites");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
app.use("/surfsites", surfsiteRoutes);
app.use("/surfsites/:id/reviews", reviewRoutes);
app.use("/users", userRoutes);

app.listen(3000, () => {
    console.log("activated: port 3000");
});

// MiddleWare

const validateSurfsite = (req, res, next) => {
    const result = surfsiteSchema.validate(req.body);
    if(result.error) {
        const msg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if(result.error) {
        const msg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res, next) => {
    next( new ExpressError(404, "Page not found!") );
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) { err.message =  "Something went wrong..."; }
    res.status(statusCode).render("error", { err });
});