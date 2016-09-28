#!/usr/local/bin/node

var env=require('../../modules/env');
var db = require('db');
//var cf = require('cf');
//var async = require('async');

// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	db.sql('select * from m.steads order by pp;', [], function(result){
		data.rows = result.rows;
		callback(data);
	}, callback_err)

};
