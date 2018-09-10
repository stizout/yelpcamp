var express    = require("express");
var index      = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
// var Campground = require("./models/campground");
var seedDB     = require("./seeds");
// var Comment    = require("./models/comment");
var passport   = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var  commentRoutes = require("./routes/comments"),
 campgroundsRoutes = require("./routes/campgrounds"),
        authRoutes = require("./routes/auth");


index.use(express.static(__dirname + "/public"));

mongoose.connect(process.env.DATABASEURL);

index.use(bodyParser.urlencoded({extended: true}));
index.set("view engine", "ejs");
// seedDB(); 
index.use(methodOverride("_method"));
index.use(flash());
// passport stuff

index.use(require("express-session")({
    secret: "whatever",
    resave: false,
    saveUninitialized: false
}));
index.use(passport.initialize());
index.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
index.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

index.use(campgroundsRoutes);
index.use(commentRoutes);
index.use(authRoutes);




index.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started");
});