var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var http = require("http");
setting_detail = {};

var config = require('./config/config'),
        mongoose = require('./config/mongoose'),
        express = require('./config/express'),
        db = mongoose(),
        app = express();
const port = '9001';
app.listen(port);

var Setting = require('mongoose').model('setting');
Setting.findOne({}, function (error, setting) {
    setting_detail = setting
    console.log('Magic happens on port ' + port); 
});		
exports = module.exports = app;
