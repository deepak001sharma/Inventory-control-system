const http = require('http');

const data = JSON.stringify({
  username: "test_final",
  email: "test_final@test.com",
  password: "abc"
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    require('fs').writeFileSync('req_out.json', JSON.stringify({status: res.statusCode, body: body}));
    console.log("Done");
  });
});

req.on('error', (err) => {
  require('fs').writeFileSync('req_out.json', JSON.stringify({error: err.message}));
  console.log("Error");
});
req.write(data);
req.end();
