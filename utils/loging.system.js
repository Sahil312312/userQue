const fs = require('fs');
const path = require('path');

// Helper function to log messages to a file
function logToFile(message) {
  const logFilePath = path.join(__dirname,'../Logs','taskLogs.txt');
  const logMessage = `${new Date().toISOString()} - ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}

module.exports = {logToFile};
