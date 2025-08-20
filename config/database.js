const mongoose = require("mongoose");

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB successfully");
    console.log("MongoDB URL:", process.env.MONGO_URL);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
