class AppError  {
    constructor(message, statusCode) {
      // super(message);
      this.message=message;
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
    }
  }
  //err module
  
  module.exports = AppError;