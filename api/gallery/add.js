#!/usr/local/bin/node

var env=require('../../modules/env');
var db = require('db');
var cf = require('cf');


// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do, (1+8));
};

var sql = "select * from tags"
// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};
	
	var title = arg.title || '';

	if(title){
		db.sql("insert into m.gallery (title, dt, enabled) values ($1, now(), false) returning *;", [title], function(result){
			if(result.rows.length>0){
				cf.mergeInto(data, result.rows[0]);
				callback(data);
			}else{
				callback_err(env.error(108));
			};
		}, callback_err);
	}else{
		callback_err(env.error(109, [data.idnews + ' - ' + data.idtag]));
	};
};

