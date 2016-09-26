#!/usr/local/bin/node
var env=require('../../modules/env');
var db = require('db');

// GO
exports.go = function(req, res){
	env.pvt_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};
	var term = arg.term || '';
	db.sql("select iduser, username, id, enabled, dt, provider, rights from public.user where username ilike '%' || $1 || '%' order by username limit 100;", [ term ], function(result){
		data.rows = result.rows;
		callback(data);
	}, callback_err)
};



