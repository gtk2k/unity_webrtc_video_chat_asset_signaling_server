"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var https = require("https");
var ws = require("ws");
var fs = require("fs");
var wns = require("./WebsocketNetworkServer");
var serveStatic = require("serve-static");
var finalhandler = require('finalhandler');
var config = require("./config.json");
console.log("This app was developed and tested with nodejs v6.9 and v8.9.1. Your current nodejs version: " + process.version);
/*

*/
if (process.env.port) {
    console.log("The environment variable process.env.port is set to " + process.env.port
        + ". Ports set in config json will be ignored");
}
if (process.env.port && config.httpConfig && config.httpsConfig) {
    //Many hosting provider set process.env.port and don't allow multiple ports 
    //If this is the case https will be deactivated to avoid a crash due to two services 
    //trying to use the same port
    console.warn("Only http/ws will be started as only one port can be set via process.env.port.");
    console.warn("Remove the httpConfig section in the config.json if you want to use https"
        + " instead or make sure the PORT variable is not set by you / your provider.");
    delete config.httpsConfig;
}
//request handler that will deliver files from public directory
//can be used like a simple http / https webserver
var serve = serveStatic("./public");
//setup
var httpServer = null;
var httpsServer = null;
//this is used to handle regular http  / https requests
//to allow checking if the server is online
function defaultRequest(req, res) {
    console.log("http/https request received");
    var done = finalhandler(req, res);
    serve(req, res, done);
}
if (config.httpConfig) {
    httpServer = http.createServer(defaultRequest);
    var options = {
        port: process.env.port || config.httpConfig.port,
        host: config.httpConfig.host
    };
    httpServer.listen(options, function () {
        console.log('websockets/http listening on ' + httpServer.address().address + ":" + httpServer.address().port);
    });
}
if (config.httpsConfig) {
    httpsServer = https.createServer({
        key: fs.readFileSync(config.httpsConfig.ssl_key_file),
        cert: fs.readFileSync(config.httpsConfig.ssl_cert_file)
    }, defaultRequest);
    var options = {
        port: process.env.port || config.httpsConfig.port,
        host: config.httpsConfig.host
    };
    httpsServer.listen(options, function () {
        console.log('secure websockets/https listening on ' + httpsServer.address().address + ":" + httpsServer.address().port);
    });
}
var websocketSignalingServer = new wns.WebsocketNetworkServer();
for (var _i = 0, _a = config.apps; _i < _a.length; _i++) {
    var app = _a[_i];
    if (httpServer) {
        //perMessageDeflate: false needs to be set to false turning off the compression. if set to true
        //the websocket library crashes if big messages are received (eg.128mb) no matter which payload is set!!!
        var webSocket = new ws.Server({
            server: httpServer,
            path: app.path,
            maxPayload: config.maxPayload,
            perMessageDeflate: false
        });
        websocketSignalingServer.addSocketServer(webSocket, app);
    }
    if (httpsServer) {
        var webSocketSecure = new ws.Server({
            server: httpsServer,
            path: app.path,
            maxPayload: config.maxPayload,
            perMessageDeflate: false
        }); //problem in the typings -> setup to only accept http not https so cast to any to turn off typechecks
        websocketSignalingServer.addSocketServer(webSocketSecure, app);
    }
}
//# sourceMappingURL=server.js.map