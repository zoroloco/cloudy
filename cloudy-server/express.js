//This is my express wrapper object where all the config for the server takes place.

const express  = require('express');
const pathUtil = require('path'),
    fs         = require('fs'),
    conf       = require(pathUtil.join(__dirname, './conf.json')),
    log        = require(pathUtil.join(__dirname, './logger.js')),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

module.exports = function() {
    let app       = express();

    log.info("Setting default and config values for express app.");

    app.set('sslPort', process.env.PORT || conf.sslPort);
    app.set('title', conf.title);

    //CONFIGURE SSL
    let pemFileName = "./security/ssl/"+process.title+".pem";
    let crtFileName = "./security/ssl/"+process.title+".crt";
    app.set('httpsOptions',
    {
        key:  fs.readFileSync(pathUtil.join(__dirname, pemFileName)),
        cert: fs.readFileSync(pathUtil.join(__dirname, crtFileName))
    });

    // get all data/stuff of the body (POST) parameters
    // parse application/json
    app.use(bodyParser.json());

    // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(methodOverride('X-HTTP-Method-Override'));

    log.info("Defining routing file.");
    require('./routes.js')(app);

    return app;
};
