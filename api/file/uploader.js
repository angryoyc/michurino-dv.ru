#!/usr/local/bin/node
/**
* Выгрузка файла на сайт. 
*
*/

var env			= require('../../modules/env');
var filestore	= require('../../modules/filestore');
var cf			= require('cf');
var async		= require('async');
var api_file_add		= require('../file/add').do;
var api_gallery_file_link	= require('../gallery/file_link').do;


// GO
exports.go = function(req, res){
	req.body.files = req.file?[req.file]:(req.files || []);
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	var stored = [];
	var idgallery = (arg.idgallery || 0);
	
	
	console.log(idgallery);

	if(idgallery>0 && cf.isArray(arg.files)){
		async.forEachLimit(
			arg.files,
			1,
			function(file, cb){
				filestore.put(file.path, file.originalname, file.mimetype, function(storedfile){
					api_file_add(storedfile, function(f){
						api_gallery_file_link({idgallery:idgallery, idfile:f.idfile}, function(result){
							data.rows=result.rows;
							cb();
						}, cb);
					}, cb);
				}, cb);
			},
			function(err){
				if(err){ callback_err(err); }else{
					callback(data);
				};
			}
		);
	}else{
		callback_err(env.error(109));
	};
};
