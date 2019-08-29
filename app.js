// consider adding dotenv to hide any API keys or DB credentials
const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      flash = require("connect-flash"),
      //authorization dependencies
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      // MODELS
      Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      User = require("./models/user"),
      seedDB = require("./seeds");

const commentRoutes = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes = require("./routes/index");

// MOVE THIS TO .gitignore file?
mongoose.connect("mongodb+srv://app:1234@yelpcamp-tvaxq.mongodb.net/yelp_camp?retryWrites=true&w=majority", {useNewUrlParser: true});
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.locals.moment = require('moment');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//RUN THIS TO REFRESH AND SEED DB WITH DATA:
// seedDB();

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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);



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

app.listen(3000, function(){
  console.log("YelpCamp Serving to port 3000");
});
