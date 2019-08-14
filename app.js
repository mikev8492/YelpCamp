const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      //authorization dependencies
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      //V3.0 MODELS
      Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      User = require("./models/user"),
      seedDB = require("./seeds");


mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//RUN THIS TO REFRESH AND SEED DB WITH DATA:
// seedDB();

//SCHEMA SETUP FOR V2.0 (moved to ./model/campground.js for refactor)

//MANUALLY INPUTS SOME STARTER DATA
// Campground.create(
//   {
//     name: "Granite Hill", image: "https://i2.wp.com/www.hachettebookgroup.com/wp-content/uploads/2019/01/WA_MoraCampground_NPS-publicdomain.jpg?resize=1080%2C1079&ssl=1", description: "Huge granit hill with dope bathrooms and shit."
//
// }, function(err, campground){
//     if (err) {
//       console.log(err)
//     } else {
//       console.log("Newly created campground: ");
//       console.log(campground);
//     }
// });


//ARRAY FOR V1.0
// var campgrounds = [
//   {name: "Salmon Creek", image: "https://dailygazette.com/sites/default/files/styles/article_image/public/180702d.jpg?itok=6L_qDMLP"},
//
//   {name: "Granite Hill", image: "https://i2.wp.com/www.hachettebookgroup.com/wp-content/uploads/2019/01/WA_MoraCampground_NPS-publicdomain.jpg?resize=1080%2C1079&ssl=1"},
//
//   {name: "Mountain Goat's Rest", image: "http://highlandschamber.org/wp-content/uploads/2015/06/tent-camping.jpg"},
//
//   {name: "Salmon Creek", image: "https://dailygazette.com/sites/default/files/styles/article_image/public/180702d.jpg?itok=6L_qDMLP"},
//
//   {name: "Granite Hill", image: "https://i2.wp.com/www.hachettebookgroup.com/wp-content/uploads/2019/01/WA_MoraCampground_NPS-publicdomain.jpg?resize=1080%2C1079&ssl=1"},
//
//   {name: "Mountain Goat's Rest", image: "http://highlandschamber.org/wp-content/uploads/2015/06/tent-camping.jpg"},
// ];

// =================================
// PASSPORT CONFIGURATION:
// =================================
app.use(require("express-session")({
  secret: "Remmy is dog",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ==================================

// custom middleware to pass currentUser to all the routes
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});


app.get('/', function(req, res){
  res.render("landing");
});

//INDEX ROUTE
app.get("/campgrounds", function(req ,res){
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
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new", {});
});

//CREATE ROUTE
app.post("/campgrounds", function(req, res){
  //GET DATA FROM FORM AND ADD TO CAMPGROUNDS VARIABLE (TO BE PUSHED TO ARRAY V1.0)
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newCampground = {name: name, image: image, description: desc}
 // campgrounds.push(newCampground);

  //CREATE NEW CAMPGROUND AND SAVE TO DB
  Campground.create(newCampground, function(err, newlyCreated){
    if (err) {
      console.log(err);
    } else {
      // REDIRECT BACK TO CAMPGROUNDS PAGE
      res.redirect("/campgrounds");
      console.log(newCampground);
    }
  });
});

//SHOW ROUTE - SHOWS MORE INFO ABOUT ONE CAMPGROUND
app.get("/campgrounds/:id", function(req, res){
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

// ==================
// COMMENTS ROUTES:
// ==================

// added isLoggedIn as middleware to only show if logged in
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
  // lookup campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
  // create new comment
  // connect new comment to campground
  // redirect campground show page

});

// ==============
// AUTH ROUTES
// ==============
app.get("/register", function(req, res){
  res.render("register");
});

// handle signup logic
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

// show login form
app.get("/login", function(req, res){
  res.render("login");
});

// app.post("/login", middleware, callback)
app.post("/login",passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res){

});

// logout logic ROUTE
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};


app.listen(3000, function(){
  console.log("YelpCamp Serving to port 3000");
});
