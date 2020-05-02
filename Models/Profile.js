const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  place: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  githublink: {
    type: String,
  },
  skills: {
    type: [String],
    required: true,
  },
  experience: {
    type: Number,
  },
  hobbies: {
    type: [String],
  },
  website: {
    type: String,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
