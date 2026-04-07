// config/db.js
import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, { serverApi: { version: '1', strict: true, deprecationErrors: true } });
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

export default connectDB;
