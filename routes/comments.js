const express = require("express"),
      router = express.Router({mergeParams: true}),
      Campground = require("../models/campground"),
      Comment = require("../models/comment"),
      middleware = require("../middleware"); //index.js will automatically use index by default

// COMMENTS NEW
// added isLoggedIn as middleware to only show if logged in
router.get("/new", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

// COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
  // lookup campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create new comment
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          // connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          // redirect campground show page
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      // the campground ID is already available in req.params.id
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
  // findByIdAndDelete
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/campgrounds" + req.params.id);
    }
  });
});

module.exports = router;
