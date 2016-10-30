#!/usr/local/bin/node

var env=require('../../modules/env');
var db = require('db');

// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do, 16);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	data.idfile = arg.idfile?parseInt(arg.idfile):0;
	data.idgallery = arg.idgallery?parseInt(arg.idgallery):0;

	if(data.idfile>0 && data.idgallery>0){
		db.sql("delete from m.gallery2files where idfile=$1 and idgallery=$2;", [data.idfile, data.idgallery], function(result){
			data.unlinked=true;
			return_data(data, callback, callback_err, data);
		}, callback_err);
	}else{
		callback_err(env.error(109, [data.idgallery + ' - ' + data.idfile]));
	};
};

var return_data = exports.return_data = function (arg, callback, callback_err, idata){
	var data = idata || {};
	db.sql("select files.idfile, files.md5, files.filename, files.mimetype, files.size, files.note from m.gallery2files inner join m.files on gallery2files.idfile=files.idfile  where gallery2files.idgallery=$1;", [data.idgallery], function(result){
		data.rows=result.rows;
		callback(data);
	}, callback_err);
};
