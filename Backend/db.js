const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.MONGOURL; 

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURL, {
//useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectToMongo;
