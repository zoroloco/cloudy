let pathUtil = require('path'),
    fs = require('fs'),
    log = require(pathUtil.join(__dirname,'../logger.js'));

const conf = require(pathUtil.join(__dirname,'../conf/conf.json'));

class FileController{

    static initFileSystem(){
        return new Promise((resolve,reject)=>{

            if(!_.isEmpty(conf.fileProperties.defaultDir)) {
                //create the log dir if it does not already exist.
                try {
                    log.info('Creating log directory:' + conf.fileProperties.defaultDir);
                    fs.mkdirSync(conf.fileProperties.defaultDir);
                    log.info('Initialized filesystem for media-files at '+conf.fileProperties.defaultDir);
                    resolve();
                } catch (e) {
                    if (e.code === 'EEXIST') {
                        log.warn(e.message);
                        resolve();
                    }
                }
            }
        });
    }
}

module.exports = FileController;
