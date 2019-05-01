let pathUtil = require('path'),
    _        = require('underscore'),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    Server   = require(pathUtil.join(__dirname,'./server.js'));
const conf   = require(pathUtil.join(__dirname,'./conf/conf.json'));

function App(){
    let self = this;
    process.title   = 'cloudy';
    process.version = conf.version;

    log.init();

    log.info('Starting '+process.title+' version:'+process.version);

    self._server = new Server().listen();

    try{
        if(!_.isEmpty(conf)){
            log.info("Using config file:\n"+JSON.stringify(conf));
        }
        else{
            log.warn("No config file defined. Bailing.");
            process.exit(1);
        }
    }
    catch(e){
        log.warn("Starting server resulted in the exception:"+e);
        process.exit(1);
    }

    //define process handlers
    process.on('SIGTERM', function() {
        log.info("Got kill signal. Exiting.");
        process.exit();
    });

    process.on('SIGINT', function() {
        log.warn("Caught interrupt signal(Ctrl-C)");
        if(!_.isEmpty(self._server)){
            self._server.shutdown();
        }
        process.exit();
    });

    process.on('exit', function(){
        log.info("server process exiting...");
    });

    process.on('uncaughtException', function (err) {
        let msg="Uncaught Exception ";
        if( err.name === 'AssertionError' ) {
            msg += err.message;
        } else {
            msg += err;
        }
        log.error(msg);
    });

}

//Starting point
new App();
