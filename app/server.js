#!/usr/bin/env node

var express = require('express'),
	path = require('path');

//controllers
var vol = require('./controllers/vol');

//application
var	app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodiess

//routes
app.use('/vol', vol);

//public files
app.use(express.static(path.join(__dirname, '/../public')));

app.listen(8004);
module.exports = app;
