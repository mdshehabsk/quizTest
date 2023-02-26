const { Schema, model } = require("mongoose");
const assessment = new Schema({
  time: Date,
  mark: Number,
});
const userSchame = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  pre_assessment: assessment,
  post_assessment: assessment,
});

const User = new model("User", userSchame);

module.exports = User;
