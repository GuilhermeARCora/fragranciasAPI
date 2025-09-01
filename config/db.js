const { ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,             
        deprecationErrors: true,
      }
    });
    console.log('✅ DB connection successful!');
  } catch (err) {
    console.error('❌ DB connection error:', err);
    process.exit(1); 
  }
};

module.exports = connectDB;
