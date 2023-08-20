const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please provide user name."],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "please provide email."],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 6,
  },
});

//mongoose middleware
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  //next(); //in updated versions passing & calling 'next()' is not neccessary
});

//mongoose instance methods
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { id: this._id, name: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWTLIFETIME,
    }
  );
};

//password camparision
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("user", userSchema);
