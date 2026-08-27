const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`ডাটাবেস সংযুক্ত: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`ডাটাবেস সংযোগ ব্যর্থ: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
