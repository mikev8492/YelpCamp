const express = require("express"),
      router = express.Router(),
      Campground = require("../models/campground");

//INDEX ROUTE
router.get("/", function(req ,res){
  //RENDERS FROM CAMPGROUNDS ARRAY FROM V1.0
  // res.render("campgrounds", {campgrounds: campgrounds});

  // GET ALL CAMPGROUNDS FROM THE DB
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

//NEW ROUTE
router.get("/new", isLoggedIn, function(req, res){
  res.render("campgrounds/new", {});
});

//CREATE ROUTE
router.post("/", isLoggedIn, function(req, res){
  //GET DATA FROM FORM AND ADD TO CAMPGROUNDS VARIABLE (TO BE PUSHED TO ARRAY V1.0)
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, image: image, description: desc, author: author}
 // campgrounds.push(newCampground);

  //CREATE NEW CAMPGROUND AND SAVE TO DB
  Campground.create(newCampground, function(err, newlyCreated){
    if (err) {
      console.log(err);
    } else {
      // REDIRECT BACK TO CAMPGROUNDS PAGE
      res.redirect("/");
      console.log(newCampground);
    }
  });
});

//SHOW ROUTE - SHOWS MORE INFO ABOUT ONE CAMPGROUND
router.get("/:id", function(req, res){
  //FIND THE CAMPGROUND WITH PROVIDED ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
      //console.log(foundCampground);
      //RENDER SHOW TEMPLATE WITH THAT CAMPGROUND
      res.render("campgrounds/show",{campground: foundCampground});
    }
  });
});

// EDIT ROUTE
router.get("/:id/edit", function(req, res){
  // is user logged in ?
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground){
      if (err) {
        res.redirect("/campgrounds");
      } else {
        // does user own the campground?
        // console.log([foundCampground.author.id, req.user._id]); --> one is a mongoDB object and one is a string
        if (foundCampground.author.id.equals(req.user._id)) {
          res.render("campgrounds/edit", {campground: foundCampground});
        } else {
          res.send("you don't have permission to do that.");
        }
      }
    });
  } else {
    res.send("You need to be logged in to do that...");
  }

    // if not, redirect

});

//UPDATE ROUTE
router.put("/:id", function (req, res) {
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // redirect to show page
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY ROUTE
router.delete("/:id", function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// MIDDLEWARE
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};


module.exports = router;
