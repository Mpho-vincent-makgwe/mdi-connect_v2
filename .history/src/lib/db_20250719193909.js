import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect(dbName = 'MDI-Connect') {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = // Add these options to your connection:
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000 // Keep trying for 5 seconds
});.then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}