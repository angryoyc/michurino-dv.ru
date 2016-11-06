#!/usr/local/bin/node
/**
* Картинка по заданному коду md5
*
*/

var env			= require('../../modules/env');
var param		= require('../../modules/param');
var filestore	= require('../../modules/filestore');
var async		= require('async');
var db		= require('db');


// GO
exports.go = function(req, res){
	req.body.md5=param(req, 'p1', '');
	env.std_go(req, res, exports.do, (8+1));
};

// DO
exports.do=function(arg, callback, callback_err){
	var data;
	var mimetype;
	var md5 = (arg.md5 || '');
	if(md5 && md5.length==32){
		async.parallel(
			[
				function(cb){
					filestore.get(md5, function(buff){
						data = buff;
						cb();
					}, cb);
				},
				function(cb){
					db.sql("select idfile, mimetype from m.files where md5=$1;", [md5], function(result){
						if(result.rows.length>0){
							mimetype=result.rows[0].mimetype;
							cb();
						}else{
							cb(env.error(104));
						};
					}, cb);
				}
			],
			function(err){
				if(err){ callback_err(err); }else{
					callback(data, mimetype);
				};
			}
		);
	}else{
		callback_err(env.error(109));
	};
};
