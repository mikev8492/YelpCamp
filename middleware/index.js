const Campground = require("../models/campground"),
      Comment = require("../models/comment");

// all middleware goes here!
var middlewareObj = {};

middlewareObj.checkCampgroundOwner = function(req, res, next){
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground){
      if (err) {
        // redirects back to previous page
        res.redirect("back");
      } else {
        // does user own the campground?
        // foundCampground.author.id != req.user._id --> one is a mongoDB object and one is a string
        if (foundCampground.author.id.equals(req.user._id)) { //equals() is a mongoose method to convert the mongo object to a string
          next(); //--> moves to next part of router function
        } else {
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
      if (err) {
        // redirects back to previous page
        res.redirect("back");
      } else {
        // does user own the comment?
        // foundComment.author.id != req.user._id --> one is a mongoDB object and one is a string
        if (foundComment.author.id.equals(req.user._id)) { //equals() is a mongoose method to convert the mongo object to a string
          next(); //--> moves to next part of router function
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    // redirects back to previous page
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middlewareObj;
