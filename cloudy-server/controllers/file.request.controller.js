let pathUtil = require('path'),
    FileController = require(pathUtil.join(__dirname,'./file.controller')),
    Logger = require(pathUtil.join(__dirname,'../logger'));

class FileRequestController{

    static postFileRequest(req,res,next){
        FileController.processFile().then(()=>{
            res.sendStatus(200);
        },
        ()=>{

        });
    };
}

module.exports = FileRequestController;
