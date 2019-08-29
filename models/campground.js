const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  cost: String,
  createdAt: {type: Date, default: Date.now},
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model("Campground", campgroundSchema);
