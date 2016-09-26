#!/usr/local/bin/node

"use strict"

var http = require('http')

var conf = require("./config.json");
var db = require('db');
var app = require('./app');
var cron = require('./modules/cron');



var colors = require('colors');
colors.setTheme(conf.color_theme);
console.log('Starting...'.blue);

db.connect(conf.db.connectionstring)
.then(
	function(){
		console.log('DB connection ok')
		var port = (1*conf.server.port) || 5000;
		console.log('.. start listening on port '.info + (''+port).params);
		http.createServer(app).listen(port, function(err){
			if(err){
				console.log(err.message.error);
			}else{
				console.log('Express server listening on port '.info + (''+port).params);
			};
		});
		cron(app, conf);
	},
	function(err){
		console.log(err);
	}
).catch(function(err){
	console.log(err);
});
