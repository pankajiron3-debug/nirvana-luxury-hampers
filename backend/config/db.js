import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nirvana_luxury_hampers', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✨ [Database] MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [Database Error] MongoDB connection failed: ${error.message}`);
    console.warn(`⚠️ [Database Warning] Please ensure MongoDB is running locally or provide a valid MONGO_URI in .env`);
  }
};

export default connectDB;
