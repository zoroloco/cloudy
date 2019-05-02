let pathUtil = require('path'),
    _        = require('underscore'),
    Logger   = require(pathUtil.join(__dirname,'./logger')),
    Server   = require(pathUtil.join(__dirname,'./server')),
    FileController = require(pathUtil.join(__dirname,'./controllers/file.controller'));
const conf = require(pathUtil.join(__dirname,'./conf/conf.json'));

function App(){
    let self = this;
    process.title   = 'cloudy';
    process.version = conf.version;

    Logger.init();

    Logger.info('Starting '+process.title+' version:'+process.version);

    FileController.initFileSystem().then(()=>{
        self._server = new Server().listen();
    },(err)=>{
        Logger.error(err);
    });

    try{
        if(!_.isEmpty(conf)){
            Logger.info("Using config file:\n"+JSON.stringify(conf));
        }
        else{
            Logger.warn("No config file defined. Bailing.");
            process.exit(1);
        }
    }
    catch(e){
        Logger.warn("Starting server resulted in the exception:"+e);
        process.exit(1);
    }

    //define process handlers
    process.on('SIGTERM', function() {
        Logger.info("Got kill signal. Exiting.");
        process.exit();
    });

    process.on('SIGINT', function() {
        Logger.warn("Caught interrupt signal(Ctrl-C)");
        if(!_.isEmpty(self._server)){
            self._server.shutdown();
        }
        process.exit();
    });

    process.on('exit', function(){
        Logger.info("server process exiting...");
    });

    process.on('uncaughtException', function (err) {
        let msg="Uncaught Exception ";
        if( err.name === 'AssertionError' ) {
            msg += err.message;
        } else {
            msg += err;
        }
        Logger.error(msg);
    });

}

//Starting point
new App();
