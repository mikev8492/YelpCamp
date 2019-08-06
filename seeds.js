const mongoose = require("mongoose");
const Campground = require("./models/campground");

var data = [
  {
    name: "Cloud's rest",
    image: "https://img.hipcamp.com/images/c_limit,f_auto,h_1200,q_60,w_1920/v1433545941/hhou7vtldtiqvgjgsoxe/humboldt-redwoods-burlington-campground.jpg",
    description: "This place got lots of freakin trees. And they big trees."
  },
  {
    name: "Granite Hill",
    image: "https://i2.wp.com/www.hachettebookgroup.com/wp-content/uploads/2019/01/WA_MoraCampground_NPS-publicdomain.jpg?resize=1080%2C1079&ssl=1",
    description: "Huge granite hill with dope bathrooms and shit."
  },
  {
    name: "Lake Lakey",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Glacier Camp",
    image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
];

function seedDB(){
  Campground.remove({}, function(err){
    if(err){
      console.log(err)
    } else {
      console.log("removed campgrounds");
        //add a few campgrounds
      data.forEach(function(seed){
        Campground.create(seed, function(err, data){
          if (err) {
            console.log(err);
          } else {
            console.log("added a campground");
            //create a comment
            Comment.create(
              {
                text: "This place is dope.",
                author: "Homer"
              }, function(err, comment){
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();\
                  console.log("created new comment");
                }
            });
          }
        });
      });
    };
  });



};

module.exports = seedDB;
