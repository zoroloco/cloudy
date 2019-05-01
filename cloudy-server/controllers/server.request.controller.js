let pathUtil       = require('path'),
    log            = require(pathUtil.join(__dirname,'../logger.js'));

class ServerRequestController{
    static auditRequest(req,res,next){
        log.info(req.method+' request to:'+req.originalUrl+' made by IP Address: '+req.ip);
        next();
    };

    static reRouteHttps(req,res,next){
        if('https' === req.protocol){
            next();
        }
        else{
            log.warn('Request not secure. Redirecting to secure site:'+req.hostname+req.url);
            res.redirect('https://'+req.hostname+req.url);
        }
    };
}

module.exports = ServerRequestController;
