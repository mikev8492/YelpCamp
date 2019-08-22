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
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  let newCampground = {name: name, image: image, description: desc, author: author}
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

// MIDDLEWARE
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};


module.exports = router;
