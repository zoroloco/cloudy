//logger singleton.
let pathUtil  = require('path')
    fs        = require('fs'),
    _         = require('underscore');

const conf = require(pathUtil.join(__dirname, './conf/conf.json'));
const winston = require('winston');

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

const log = winston.createLogger({
    levels: config.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.label({label:'['+process.title+']'}),
        winston.format.timestamp({format:'YY-MM-DD HH:MM:SS'}),
        winston.format.printf(
            info => `${info.timestamp}  ${info.level} : ${info.message}`
        )
    ),
    transports: [
        new winston.transports.Console({handleExceptions: true})
    ],
    level: 'info'
});

class Logger{

    static init(){
        if(conf.logger.enabled){
            if(!_.isEmpty(conf.logger.dir)){
                //create the log dir if it does not already exist.
                try {
                    log.info('Creating log directory:'+conf.logger.dir);
                    fs.mkdirSync(conf.logger.dir);
                }
                catch(e) {
                    if ( e.code === 'EEXIST' ){
                        log.warn('Log directory already exists. '+conf.logger.dir);
                    }
                }

                const debugFileLog =
                    new winston.transports.File({ level: 'debug',
                        filename: pathUtil.join(conf.logger.dir,conf.hostname+'_'+'debug.log'),
                        maxFiles: 256,
                        maxsize:4194304,
                        handleExceptions: true});
                const infoFileLog =
                    new winston.transports.File({ level: 'info',
                        filename: pathUtil.join(conf.logger.dir,conf.hostname+'_'+'info.log'),
                        maxFiles: 256,
                        maxsize:4194304,
                        handleExceptions: true});

                const warnFileLog =
                    new winston.transports.File({ level: 'warn',
                        filename: pathUtil.join(conf.logger.dir,conf.hostname+'_'+'warn.log'),
                        maxFiles: 256,
                        maxsize:4194304,
                        handleExceptions: true});

                const errorFileLog =
                    new winston.transports.File({ level: 'error',
                        filename: pathUtil.join(conf.logger.dir,conf.hostname+'_'+'error.log'),
                        maxFiles: 256,
                        maxsize:4194304,
                        handleExceptions: true});


                if(conf.logger.debug === true){
                    log.add(debugFileLog);
                }

                log.add(infoFileLog);
                log.add(warnFileLog);
                log.add(errorFileLog);

                log.info('Log files will be located in:'+conf.logger.dir);
            }
        }
    }

    static debug(msg){
        if(conf.logger.debug && conf.logger.enabled)
            log.debug(msg);
    }

    static info(msg){
        if(conf.logger.enabled)
            log.info(msg);
    }

    static warn(msg){
        if(conf.logger.enabled)
            log.warn(msg);
    }

    static error(msg){
        if(conf.logger.enabled)
            log.error(msg);
    }
}

module.exports = Logger;

