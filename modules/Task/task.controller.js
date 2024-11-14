const { logToFile } = require("../../utils/loging.system")


exports.task =  async (req,res) => {
    try{
        logToFile(`proccess of userId - ${req.body.userId} is successfully processed`)
        
        res.status(200).json({
        status:"success",
        data:{
            currStatus : "Proccess is successfully proccessed"
        }
    })
    }catch{
        res.status(500).json({
            status:"failed",
            message:"Internal Server Err"
        })
    }
    

    
}