let pathUtil = require('path'),
    fs = require('fs'),
    Logger = require(pathUtil.join(__dirname,'../logger.js'));

const conf = require(pathUtil.join(__dirname,'../conf/conf.json'));

class FileController{

    static initFileSystem(){
        return new Promise((resolve,reject)=>{

            if(!_.isEmpty(conf.fileProperties.defaultDir)) {
                //create the Logger dir if it does not already exist.
                try {
                    Logger.info('Creating Logger directory:' + conf.fileProperties.defaultDir);
                    fs.mkdirSync(conf.fileProperties.defaultDir);
                    Logger.info('Initialized filesystem for media-files at '+conf.fileProperties.defaultDir);
                    resolve();
                } catch (e) {
                    if (e.code === 'EEXIST') {
                        Logger.warn(e.message);
                        resolve();
                    }
                }
            }
        });
    }

    /**
     * Saves a file to the filesystem.
     *
     * @returns {Promise<any>}
     */
    static processFile(){
        return new Promise((resolve,reject)=>{
            //TODO:implement
            resolve();
        });
    }
}

module.exports = FileController;
