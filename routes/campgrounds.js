var express     = require("express"),
     router     = express.Router(),
     Campground = require("../models/campground"),
     middleware = require("../middleware");

//****************** Index Route
router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log("error");
        } else {
            res.render("campgrounds/campgrounds", {campgrounds: allcampgrounds});
        }
    });
});
// ***********NEW ROUTE

router.get("/campgrounds/new",middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});

// *****************CREATE ROUTE
router.post("/campgrounds",middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});
// ******************SHOW ROUTES
router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err) {
           console.log(err);
       } else {
            res.render("campgrounds/show", {campground: foundCampground});
       }
    });
   
});

// ***************EDIT ROUTE
router.get("/campgrounds/:id/edit",middleware.verifyUser, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit.ejs", {campground: foundCampground});
    });
});

// *************UPDATE ROUTE

router.put("/campgrounds/:id",middleware.verifyUser, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground){
        if(err){
            res.redirect("/campgrounds");
        }  else {
            req.flash("success", "Campground updated!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// *************DESTROY ROUTE

router.delete("/campgrounds/:id",middleware.verifyUser, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground removed")
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;