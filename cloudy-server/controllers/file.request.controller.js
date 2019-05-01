let pathUtil       = require('path'),
    log            = require(pathUtil.join(__dirname,'../logger.js'));

class FileRequestController{

    static postFileRequest(req,res,next){
        log.error('Got file to save!');

        res.sendStatus(200);
    };
}

module.exports = FileRequestController;
