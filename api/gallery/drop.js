#!/usr/local/bin/node

var env=require('../../modules/env');
var db = require('db');

// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do, (1+8));
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};
	data.idgallery = arg.idgallery?parseInt(arg.idgallery):0;
	if(data.idgallery>0){
		db.sql("select * from m.gallery where idgallery=$1;", [data.idgallery], function(result){
			if(!(result.rows.length>0)){
				db.sql("delete from m.gallery where idgallery=$1;", [data.idgallery], function(result){
					data.deleted = true;
					callback(data);
				}, callback_err);
			}else{
				callback_err(env.error(110));
			};
		}, callback_err);
	}else{
		callback_err(env.error(109, [data.idgallery]));
	};
};
