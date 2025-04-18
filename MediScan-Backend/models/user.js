const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    default: "Guest",
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
