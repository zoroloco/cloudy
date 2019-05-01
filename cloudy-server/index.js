var pathUtil = require('path'),
    _        = require('underscore'),
    express  = require(pathUtil.join(__dirname,'./express.js')),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    conf     = require(pathUtil.join(__dirname,'./conf.json')),
    https    = require('https');

log.init();

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

process.title = 'cloudy';

let app = express();//start the server.

let httpsServer = https.createServer(app.get('httpsOptions'),app).listen(app.get('sslPort'),function(){
    log.info(process.title+" server now listening on SSL port:"+httpsServer.address().port);
});

//define process handlers
process.on('SIGTERM', function() {
    log.info("Got kill signal. Exiting.");
    httpsServer.close();
    process.exit();
});

process.on('SIGINT', function() {
    log.warn("Caught interrupt signal(Ctrl-C)");
    httpsServer.close();
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
