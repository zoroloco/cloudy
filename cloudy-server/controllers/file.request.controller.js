let pathUtil       = require('path'),
    FileController = require(pathUtil.join(__dirname,'./file.controller')),
    log            = require(pathUtil.join(__dirname,'../logger.js'));

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
