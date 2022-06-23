const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      lowercase: true,
      maxLength: 30,
    },
    userName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 30,
    },
  },
  { collection: "users" }
);

// lets create a model from UserSchema
const User = mongoose.model("User", userSchema);

module.exports = User;
