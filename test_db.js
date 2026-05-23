const fs = require('fs');
//const mongoose = require('mongoose');//
import mongoose from "mongoose";
import user from './backend/models/User.js'; 
//const User = require('./backend/models/User');//

async function test() {
  try {
    console.log("Connecting to MongoDB...");

    
    await mongoose.connect('mongodb://localhost:27017/inventory');

    console.log("MongoDB Connected Successfully");

    const user = await User.create({
      username: 'test_db_3',
      email: 'test_db_3@test.com',
      password: '123'
    });

    console.log("User created:", user._id);

    fs.writeFileSync('test_out.txt', "Success: " + user._id);
  } catch (e) {
    console.error("Error:", e.message);

    fs.writeFileSync('test_out.txt', "Failed: " + e.stack);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

test();