const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Schema set up for V2.0
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);


//array for V1.0
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

app.get('/', function(req, res){
  res.render("landing");
});

//INDEX route
app.get("/campgrounds", function(req ,res){
  //renders from campgrounds array for V1.0
  // res.render("campgrounds", {campgrounds: campgrounds});

  Get all campgrounds from the DB
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", {campgrounds: allCampgrounds});
    }
  });
});

//NEW route
app.get("/campgrounds/new", function(req, res){
  res.render("new", {});
});

//CREATE route
app.post("/campgrounds", function(req, res){
  //get data from form and add to campgrounds array
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = {name: name, image: image}
 // campgrounds.push(newCampground);

  //create new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if (err) {
      console.log(err);
    } else {
      redirect back to campgrounds Page
      res.redirect("/campgrounds");
    }
  });
});

app.listen(3000, function(){
  console.log("YelpCamp Serving to port 3000");
});
