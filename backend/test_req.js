const User = require('./models/User');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

connectDB().then(async () => {
  try {
    const user = await User.create({ username: 'test_db_5', email: 'test_db_5@test.com', password: '123' });
    console.log("Success ID:", user._id);
  } catch (e) {
    console.error("Failed:", e.stack);
  }
  process.exit();
}).catch(console.error);
