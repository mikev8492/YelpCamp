const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
  {name: "Salmon Creek", image: "https://dailygazette.com/sites/default/files/styles/article_image/public/180702d.jpg?itok=6L_qDMLP"},

  {name: "Granite Hill", image: "https://i2.wp.com/www.hachettebookgroup.com/wp-content/uploads/2019/01/WA_MoraCampground_NPS-publicdomain.jpg?resize=1080%2C1079&ssl=1"},

  {name: "Mountain Goat's Rest", image: "http://highlandschamber.org/wp-content/uploads/2015/06/tent-camping.jpg"},
];

app.get('/', function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req ,res){
  res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res){
  res.render("new", {});
});

app.post("/campgrounds", function(req, res){
  res.send("post route working");
});

app.listen(3000, function(){
  console.log("YelpCamp Serving to port 3000");
});
