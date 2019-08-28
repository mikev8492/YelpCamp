const Campground = require("../models/campground"),
      Comment = require("../models/comment");

// all middleware goes here!
var middlewareObj = {};

middlewareObj.checkCampgroundOwner = function(req, res, next){
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground){
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
        // redirects back to previous page
        res.redirect("back");
      } else {
        // does user own the campground?
        // foundCampground.author.id != req.user._id --> one is a mongoDB object and one is a string
        if (foundCampground.author.id.equals(req.user._id)) { //equals() is a mongoose method to convert the mongo object to a string
          next(); //--> moves to next part of router function
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    // redirects back to previous page
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwner = function(req, res, next){
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if (err || !foundComment) {
        console.log(err);
        req.flash('error', 'Sorry, that comment does not exist!');
        // redirects back to previous page
        res.redirect("back");
      } else {
        // does user own the comment?
        // foundComment.author.id != req.user._id --> one is a mongoDB object and one is a string
        if (foundComment.author.id.equals(req.user._id)) { //equals() is a mongoose method to convert the mongo object to a string
          next(); //--> moves to next part of router function
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    // redirects back to previous page
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
};

module.exports = middlewareObj;
