//This script defines the routes taken by the server.

const pathUtil = require('path');
const log      = require(pathUtil.join(__dirname, './logger'));
const cors     = require('cors');
const serverController = require(pathUtil.join(__dirname, './controllers/server.request.controller'));
const fileController = require(pathUtil.join(__dirname, './controllers/file.request.controller'));

module.exports = function(app) {
    //order important here.

    //EVERYTHING WILL BE AUDITED AND REROUTED TO SECURE SITE.
    app.use(cors(),
        serverController.auditRequest,
        serverController.reRouteHttps
    );

    app.get('/',function(req,res){
        res.sendStatus(404);
    });

    app.post('/postFile',fileController.postFileRequest);

    //everything else is a 404, not found.
    app.get('*',function(req,res){
        res.sendStatus(404);
    });

    //error middleware triggered by next('some error');
    //error handling middleware is always declared last.
    app.use(function(err,req,res,next){
        log.error('Error middleware caught with error:'+err);
        res.sendStatus(err);
    });
};
