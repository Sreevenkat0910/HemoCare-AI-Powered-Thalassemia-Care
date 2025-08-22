import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env['NODE_ENV'] === 'production' 
  ? process.env['MONGODB_URI_PROD'] 
  : process.env['MONGODB_URI'] || 'mongodb://localhost:27017/hemocare_db';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ MongoDB connected successfully.');
    
    // Set mongoose options
    mongoose.set('strictQuery', false);
    
    // Connection event handlers
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Unable to connect to MongoDB:', error);
    throw error;
  }
};

export default mongoose;
