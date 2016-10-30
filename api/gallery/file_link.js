#!/usr/local/bin/node

var env=require('../../modules/env');
var db = require('db');
var return_data = require('../gallery/file_unlink').return_data;

// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do, (1+8));
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	data.idfile = arg.idfile?parseInt(arg.idfile):0;
	data.idgallery = arg.idgallery?parseInt(arg.idgallery):0;

	if(data.idfile>0 && data.idgallery>0){
		db.sql("select * from m.gallery2files where idfile=$1 and idgallery=$2;", [data.idfile, data.idgallery], function(result){
			if(!(result.rows.length>0)){
				db.sql("insert into m.gallery2files (idfile, idgallery) values ($1, $2);", [data.idfile, data.idgallery], function(result){
					data.linked = true;
					return_data(data, callback, callback_err, data);
				}, callback_err);
			}else{
				callback_err(env.error(110));
			};
		}, callback_err);
	}else{
		callback_err(env.error(109, [data.idgallery + ' - ' + data.idfile]));
	};
};
