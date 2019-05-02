let pathUtil = require('path'),
    Logger = require(pathUtil.join(__dirname,'../logger'));

class ServerRequestController{
    static auditRequest(req,res,next){
        Logger.info(req.method+' request to:'+req.originalUrl+' made by IP Address: '+req.ip);
        next();
    };

    static reRouteHttps(req,res,next){
        if('https' === req.protocol){
            next();
        }
        else{
            Logger.warn('Request not secure. Redirecting to secure site:'+req.hostname+req.url);
            res.redirect('https://'+req.hostname+req.url);
        }
    };
}

module.exports = ServerRequestController;
