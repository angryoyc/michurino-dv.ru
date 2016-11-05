#!/usr/local/bin/node

var env=require('../../modules/env');
var db = require('db');

// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do, 1);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	db.sql('select * from m.params order by idparam;', [], function(result){
		data.rows=result.rows;
		callback(data);
	}, callback_err);

};

