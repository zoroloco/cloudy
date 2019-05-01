//logger singleton.
const winston = require('winston');
const { createLogger, transports, format } = require('winston'),
    pathUtil  = require('path'),
    fs        = require('fs'),
    _         = require('underscore'),
    conf      = require(pathUtil.join(__dirname, './conf.json'));

const { combine, timestamp, label, prettyPrint } = format;

//
// Logging levels
//
const config = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        data: 'grey',
        info: 'green',
        verbose: 'cyan'
    }
};

winston.addColors(config.colors);

const log = module.exports = winston.createLogger({
    levels: config.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.label({label:'['+process.title+']'}),
        winston.format.timestamp({format:"YY-MM-DD HH:MM:SS"}),
        winston.format.printf(
            info => `${info.timestamp}  ${info.level} : ${info.message}`
        )
    ),
    transports: [
        new winston.transports.Console()
    ],
    level: 'info'
});

var self = module.exports = {

    /*
      Init should pass in an object that looks like the following:
    "logger" : {
      "enabled" : false | true,
      "dir"     : "",
      "debug"   : false | true
    }
    */
    init: function init(){
        if(conf.logger.enabled){
            if(!_.isEmpty(conf.logger.dir)){
                //create the log dir if it does not already exist.
                try {
                    log.info("Creating log directory:"+conf.logger.dir);
                    fs.mkdirSync(conf.logger.dir);
                }
                catch(e) {
                    if ( e.code !== 'EEXIST' ){
                        log.error("Log directory already exists. "+conf.logger.dir);
                        throw e;
                    }
                }

                const debugFileLog =
                    new winston.transports.File({ level: 'debug',
                                                          filename: pathUtil.join(conf.logger.dir,conf.hostname+"_"+"debug.log"),
                                                          maxFiles: 256,
                                                          maxsize:4194304,
                                                          handleExceptions: true});
                const infoFileLog =
                    new winston.transports.File({ level: 'info',
                        filename: pathUtil.join(conf.logger.dir,conf.hostname+"_"+"info.log"),
                        maxFiles: 256,
                        maxsize:4194304,
                        handleExceptions: true});

                const warnFileLog =
                    new winston.transports.File({ level: 'warn',
                        filename: pathUtil.join(conf.logger.dir,conf.hostname+"_"+"warn.log"),
                        maxFiles: 256,
                        maxsize:4194304,
                        handleExceptions: true});

                const errorFileLog =
                    new winston.transports.File({ level: 'error',
                        filename: pathUtil.join(conf.logger.dir,conf.hostname+"_"+"error.log"),
                        maxFiles: 256,
                        maxsize:4194304,
                        handleExceptions: true});


                if(conf.logger.debug === true){
                    log.add(debugFileLog);
                }

                log.add(infoFileLog);
                log.add(warnFileLog);
                log.add(errorFileLog);

                log.info("Log files will be located in:"+conf.logger.dir);
            }
        }
    },

    debug: function debug(msg){
        if(conf.logger.debug && conf.logger.enabled)
            log.debug(msg);
    },

    info: function info(msg){
        if(conf.logger.enabled)
            log.info(msg);
    },

    warn: function warn(msg){
        if(conf.logger.enabled)
            log.warn(msg);
    },

    error: function error(msg){
        if(conf.logger.enabled)
            log.error(msg);
    }

};
