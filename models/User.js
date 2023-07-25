const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please add a first name"],
    },
    last_name: {
      type: String,
      required: [true, "Please add a last name"],
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Please add a username"],
    },
    password: {
      type: String,
      select: false,
      minlength: 6,
      required: [true, "Please add an password"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    info: {
      type: String,
      minlength: 10,
    },
    phoneNumber: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    photo: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
