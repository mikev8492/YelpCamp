const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user");

// ROOT ROUTE
router.get('/', function(req, res){
  res.render("landing");
});

// AUTHORIZATION
// show register form
router.get("/register", function(req, res){
  res.render("register");
});

// handle signup logic
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      req.flash("error", err.message);
      console.log(err);
      res.redirect("register");//make sure to use redirect to allow the flash message to display on reload
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to YelpCamp " + user.username + "!");
      res.redirect("/campgrounds");
    });
  });
});

// show login form
router.get("/login", function(req, res){
  res.render("login");
});

// router.post("/login", middleware, callback)
router.post("/login",passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res){

});

// logout logic ROUTE
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/campgrounds");
});


module.exports = router;
