var express = require("express"),
     router = express.Router({mergeParams: true}),
     Campground = require("../models/campground"),
     Comment = require("../models/comment"),
     middleware = require("../middleware");

// new comments
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn, function(req, res){
        Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new.ejs", {campground: campground});
        }
    });
});

// create comments
router.post("/campgrounds/:id/comments",middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Edit Comment Route

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.verifyCommentUser, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit.ejs", {campground_id: req.params.id, comment: foundComment});
        }
    });
   
});

// Update Comment Route

router.put("/campgrounds/:id/comments/:comment_id", middleware.verifyCommentUser, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Remove comment Route

router.delete("/campgrounds/:id/comments/:comment_id", middleware.verifyCommentUser, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err, removeComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;