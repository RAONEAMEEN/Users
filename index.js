const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Directory for storing logs
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Endpoint to track user data
app.post('/track', (req, res) => {
  const { jid, name } = req.body;

  if (!jid || !name) {
    return res.status(400).send('JID and name are required');
  }

  const logFile = path.join(logDir, 'user_data.log');
  const logEntry = `JID: ${jid}, Name: ${name}, Timestamp: ${new Date().toISOString()}\n`;

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send('Data tracked successfully');
  });
});

// Serve a simple homepage
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Tracking Site</h1>');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
