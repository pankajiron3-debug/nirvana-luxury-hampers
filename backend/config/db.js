import mongoose from 'mongoose';

const connectDB = async () => {
  // Serverless Fix: Agar connection pehle se zinda hai (readyState 1), toh wahi use karo
  if (mongoose.connection.readyState >= 1) {
    console.log(`⚡ [Database] Using existing MongoDB connection`);
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nirvana_luxury_hampers', {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false, // Time-out hone par requests ko latkane se rokta hai
    });
    console.log(`✨ [Database] MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [Database Error] MongoDB connection failed: ${error.message}`);
    console.warn(`⚠️ [Database Warning] Please ensure MongoDB is running locally or provide a valid MONGO_URI in .env`);
  }
};

export default connectDB;