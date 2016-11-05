#!/usr/local/bin/node
/**
* Добавление файла. Возвращаем idfile добавленного файла
*
*/

var env			= require('../../modules/env');
var db			= require('db');

//var async		= require('async');

// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do, (8+1));
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};
	var md5 = arg.md5 || '';
	var path = arg.path || '';
	var filename = arg.filename || '';
	var mimetype = arg.mimetype || '';
	var size = arg.size?parseInt(arg.size):0;
	if(md5){
		db.sql("select idfile from m.files where md5=$1;", [md5], function(result){
			if(result.rows.length>0){
				// запись об этом файле уже присутствует в базе. Перезапишем имя и mimetype
				data.idfile = result.rows[0].idfile;
				db.sql("update m.files set filename=$2, mimetype=$3, size=$4, path=$5 where idfile=$1;", [result.rows[0].idfile, filename, mimetype, size, path], function(result){
					callback(data);
				}, callback_err);
			}else{
				// запись об этом файле отсутствует в базе. Создадим ее (md5, имя и mimetype)
				var values = [filename, mimetype, md5, path, size];
				db.sql("insert into m.files (filename, mimetype, md5, path, type, size) values ($1, $2, $3, $4, 'image', $5) returning idfile;", values, function(result){
					data.idfile = result.rows[0].idfile;
					callback(data);
				}, callback_err);
			};
		}, callback_err);
	}else{
		callback_err(env.error(109, [md5]));
	};
};
