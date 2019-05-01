let pathUtil = require('path'),
    log = require(pathUtil.join(__dirname,'../logger.js'));

const conf = require(pathUtil.join(__dirname,'../conf/conf.json'));
const swaggerDoc = require(pathUtil.join(__dirname,'../conf/swagger.json'));

class SwaggerController{
    constructor(){
        this.configuredSwagDoc = swaggerDoc;
        this.configuredSwagDoc.info.version = conf.version;
        this.configuredSwagDoc.host = 'localhost:'+conf.sslPort;
        this.url = conf.swaggerConf.url;
    }

    getDoc(){
        return this.configuredSwagDoc;
    }

    getUrl(){
        return this.url;
    }
}

module.exports = SwaggerController;
