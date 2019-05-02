let pathUtil = require('path'),
    _ = require('underscore'),
    Logger = require(pathUtil.join(__dirname,'./logger')),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    methodOverride = require('method-override'),
    https = require('https'),
    SwaggerController = require(pathUtil.join(__dirname,'./controllers/swagger.controller'));

const conf = require(pathUtil.join(__dirname,'./conf/conf.json'));
const express = require('express');
const swaggerUi = require('swagger-ui-express');

class Server{

    constructor(swagger,x){
        this.swagger = new SwaggerController();
        this.x = express();

        Logger.info('Setting default and config values for express app.');

        this.x.set('sslPort', process.env.PORT || conf.sslPort);
        this.x.set('title', conf.title);

        //CONFIGURE SSL
        let pemFileName = './security/ssl/'+process.title.replace(' ','')+'.pem';
        let crtFileName = './security/ssl/'+process.title.replace(' ','')+'.crt';
        this.x.set('httpsOptions',
            {
                key:  fs.readFileSync(pathUtil.join(__dirname, pemFileName)),
                cert: fs.readFileSync(pathUtil.join(__dirname, crtFileName))
            });

        // get all data/stuff of the body (POST) parameters
        // parse application/json
        this.x.use(bodyParser.json());

        // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
        this.x.use(methodOverride('X-HTTP-Method-Override'));
        this.x.use(this.swagger.getUrl(), swaggerUi.serve, swaggerUi.setup(this.swagger.getDoc()));

        Logger.info('Defining routing file.');
        require('./routes.js')(this.x);

        this.x.use(this.swagger.getUrl(), swaggerUi.serve, swaggerUi.setup(this.swagger.getDoc()));
        Logger.info('Swagger enabled. Available at:'+this.swagger.getUrl());
    }

    listen(){
        this.httpsServer = https.createServer(this.x.get('httpsOptions'),this.x).listen(this.x.get('sslPort'),function(){
            Logger.info(process.title+' server now listening on SSL port:'+conf.sslPort);
        });
    }

    shutdown(){
        if(!_.isEmpty(this.httpsServer)){
            this.httpsServer.close();
        }
    }
}

module.exports = Server;
