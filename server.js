var path = require('path');
var express = require('express');
var http = require('http');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var util = require('util');
var querystring = require('querystring');
var url = require('url');
var app = express();
var port = process.env.PORT || 8080;

function init(){
    configureExpress(app);
}

init();

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/data';

var db = mongoose.createConnection(mongoUri)
db.on("error", function(err) {
      console.log("MongoDB connection error:", err);
});

db.once("open", function() {
  console.log("MongoDB connected");
});

function configureExpress(app){
    app.configure(function(){

      app.use(express.logger());
      app.use(express.cookieParser());
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(express.session({secret:"keyboard cat"}));
      app.use(express.static(path.join(__dirname, 'public')));

        app.use(app.router);
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });
}

// CORS Mtitledleware that sends HTTP headers with every request
// Allows connections from http://localhost:8081
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://rocky-earth-8065.herokuapp.com/');
    res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');

    next();
}

var Schema = mongoose.Schema;
var Collection = mongoose.Collection;
