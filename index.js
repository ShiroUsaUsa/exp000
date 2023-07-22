const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3333;
const logFilePath = path.join(__dirname, 'visitor.log');

// Create a write stream to the log file
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Logging middleware
app.use(morgan('combined', { stream: accessLogStream }));

// Serve the image
app.use(express.static(path.join(__dirname, 'images')));

// Log visitors on each request
app.use((req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] New visitor: ${req.ip}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to the log file:', err);
    }
  });
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
