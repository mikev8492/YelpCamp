const express = require("express"),
      router = express.Router(),
      Campground = require("../models/campground"),
      middleware = require("../middleware"); //index.js will automatically use index by default

//INDEX ROUTE
router.get("/", function(req ,res){
  //RENDERS FROM CAMPGROUNDS ARRAY FROM V1.0
  // res.render("campgrounds", {campgrounds: campgrounds});

  // GET ALL CAMPGROUNDS FROM THE DB
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
    }
  });
});

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
  //GET DATA FROM FORM AND ADD TO CAMPGROUNDS VARIABLE (TO BE PUSHED TO ARRAY V1.0)
  var name = req.body.name;
  var cost = req.body.cost;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, cost: cost, image: image, description: desc, author: author}
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
    if (err || !foundCampground) {
      req.flash('error', 'Sorry, that campground does not exist!');
      console.log(err);
    } else {
      //RENDER SHOW TEMPLATE WITH THAT CAMPGROUND
      res.render("campgrounds/show",{campground: foundCampground});
    }
  });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    // technically don't need an error handler here because findById is already run in the checkCampgroundOwner function
    if (err) {
      res.redirect("/campgrounds");
    } else {

        if (!foundCampground) {
            return res.status(400).send("Item not found.")
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    }
  });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwner, function (req, res) {
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
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
