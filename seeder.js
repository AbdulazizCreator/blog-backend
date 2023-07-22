const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
// Load env vars
dotenv.config({ path: "./config/config.env" });


// Load models
const Post = require("./models/Post");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Delete data
const deleteData = async () => {
  try {
    await Post.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

deleteData();
