const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');

require('dotenv').config();

async function run() {
  try {
    const uri = process.env.MONGO_URI || "mongodb+srv://deepak001bhardwaj_db_user:deepak001@inventory.jhlixqf.mongodb.net/inventory";
    await mongoose.connect(uri);
    console.log("Connected directly to MongoDB.");
    
    try {
      const u = new User({ username: 'test_u_' + Date.now(), email: 'test_u_' + Date.now() + '@test.com', password: '123' });
      await u.save();
      console.log("User saved:", u._id);
    } catch (e) {
      console.error("User save failed:", e.message);
    }

    try {
      const c = new Category({ name: 'test_cat_' + Date.now(), description: 'test' });
      await c.save();
      console.log("Category saved:", c._id);
    } catch (e) {
      console.error("Category save failed:", e.message);
    }
    
    process.exit(0);
  } catch(e) {
    require('fs').writeFileSync('mongoose_err.txt', e.stack);
    console.error("Connection failed:", e.stack);
    process.exit(1);
  }
}
run();
