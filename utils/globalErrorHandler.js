const dotenv = require('dotenv')
dotenv.config({path : '../config.env'});


const sendErrorDev = (err,res) => {
   if (err.isOperational) {
    res.status(err.statusCode).json({
      statusCode:err.statusCode,
      errors:err.message
    });
}else{
     res.status(500).json({
      status: "error",
      // err,
      message: "Something went very wrong!",
    });
}
}

module.exports = (err,req,res,next) => {
    // console.log(err);

     err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(process.env.NODE_ENV === "development"){
        sendErrorDev(err,res)
    }
}