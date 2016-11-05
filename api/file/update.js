#!/usr/local/bin/node
/**
* Изменение параметров файла (title, note)
*
*/

var env			= require('../../modules/env');
//var param		= require('../../modules/param');
//var filestore	= require('../../modules/filestore');
//var async		= require('async');
var db		= require('db');
var cf		= require('cf');



// GO
exports.go = function(req, res){
//	req.body.md5=param(req, 'p1', '');
	env.std_go(req, res, exports.do, (8+1));
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};
	var idfile = arg.idfile?parseInt(arg.idfile):0;
	if(idfile>0){
		returnData(idfile, function(olddata){
			db.sql("update m.files set title=$2, note=$3 where idfile=$1;", [idfile, arg.title || '', arg.note || ''], function(result){
				returnData(idfile, callback, callback_err, data);
			}, callback_err);
				
		}, callback_err, {});
	}else{
		callback_err(env.error(109));
	};
};

function returnData(idfile, callback, callback_err, idata){
	var data = idata || {};
	db.sql("select idfile, mimetype, title, note, filename, size from m.files where idfile=$1;", [idfile], function(result){
		if(result.rows.length>0){
			cf.mergeInto(data, result.rows[0]);
			callback(data);
		}else{
			callback_err(env.error(104));
		};
	}, callback_err);
}