import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-placement-portal';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn('Primary MongoDB connection failed:', error.message);
    // In development, fall back to in-memory server so the app remains usable
    if (process.env.NODE_ENV !== 'production') {
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const memUri = mongodInstance.getUri();
        const conn = await mongoose.connect(memUri);
        console.log('Connected to in-memory MongoDB for development');
        return conn;
      } catch (memErr) {
        console.error('Failed to start in-memory MongoDB:', memErr);
        process.exit(1);
      }
    }
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

export default connectDB;
