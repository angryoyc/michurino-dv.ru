#!/usr/local/bin/node

var env=require('../../modules/env');
var db = require('db');
var cf = require('cf');
var async = require('async');


// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};
	data.idgallery = parseInt(arg.idgallery);
	db.sql("select *, to_char(dt, 'DD-MM-YYYY HH24:MI:SS') as dt_h from m.gallery where idgallery=$1", [data.idgallery], function(result){
		if(result.rows.length>0){
			cf.mergeInto(data, result.rows[0]);
			async.parallel(
				[
					function(cb){ //- Файлы
						db.sql('select files.idfile, files.filename, note, md5, mimetype, size from m.gallery2files inner join m.files on files.idfile=gallery2files.idfile where gallery2files.idgallery=$1;', [data.idgallery], function(result){
							data.files = result.rows;
							cb();
						}, cb)
					}
				],
				function(err){
					env.callback(err, function(){
						callback(data);
					}, callback_err);
				}
			);
		}else{
			callback_err(env.error(104, [data.idgallery]));
		};
	}, callback_err);
};
