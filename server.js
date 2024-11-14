const cluster = require('node:cluster');
const express = require('express');
const client = require('./redis.client');
const processQueue = require('./middleware/processQueue')
const v1Router = require('./Routes/index')
const AppError = require('./utils/app.error');
const dotenv = require("dotenv");
dotenv.config({path:"./config.env"})


const globalErrorHandler = require('./utils/globalErrorHandler');


//dividing application into Two Worker and One master Node architecture
if (cluster.isPrimary) {
  for (let i = 0; i < 2; i++) {
    cluster.fork();
  }
//If any worker Node fails then this will handle error
  cluster.on('exit', (worker, code) => {
    console.log(`worker ${worker.process.pid} died. ErrCode: ${code}`);
  });
} else {

  const app = express();
  app.use(express.json());
  v1Router(app);

  app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//adding globalErrorHandler

app.use(globalErrorHandler)

  // Run processQueue every second to process queued tasks
  setInterval(processQueue, 1000);

  app.listen(3000, () => {
    console.log(`Worker ${process.pid} is listening on port 3000`);
  });


//When an exception is thrown but not caught in a try-catch block. 

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

//Rejection is not handled in code with a .catch() or try-catch block for async function

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

}
