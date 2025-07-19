import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

let isConnected = false; // Track connection status

export default async function dbConnect(dbName) {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: dbName, // Add this if your connection string doesn't specify the DB
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to MongoDB ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌:", error);
    process.exit(1); // Kill server if DB fails
  }
}
