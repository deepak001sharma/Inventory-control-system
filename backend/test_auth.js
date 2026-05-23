const { registerUser } = require('./controllers/auth.controller');
const User = require('./models/User');
const connectDB = require('./config/db');
require('dotenv').config();

const req = {
  body: {
    username: 'test_auth_' + Date.now(),
    email: 'test_auth_' + Date.now() + '@test.com',
    password: '123'
  }
};

const res = {
  status: (code) => {
    require('fs').writeFileSync('out.txt', "Status: " + code);
    return {
      json: (data) => {
        require('fs').appendFileSync('out.txt', " JSON: " + JSON.stringify(data));
        process.exit();
      }
    };
  }
};

connectDB().then(async () => {
  await registerUser(req, res);
}).catch(e => {
  require('fs').writeFileSync('out.txt', "ERROR: " + e.message);
  process.exit();
});
