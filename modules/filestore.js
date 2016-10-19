var crypto     = require('crypto');
//var mv         = require('mv');
var fs         = require('fs');
var db         = require('db');
var async      = require('async');
var pfs        = require('promisedfs');
var conf       = require('../config.json');
var env        = require('../modules/env');

//var util=require('util');

exports.put=function(path, filename, mimetype, callback, callback_err, idata){
	var data = idata || {};
	var fordelete = [path];
	var c_err = function(err){
		fordelete.forEach(function(f){
			pfs.rm(f);
		});
		if(typeof(callback_err)=='function'){
			callback_err(err);
		} else if(typeof(callback)=='function') callback();
	};
	var filestorepath = conf.filestore.path;
	pfs.isfile(path)
	.then(function(exists){
		return pfs.isfolder(filestorepath);
	})
	.then(function(){
		return pfs.md5(path);
	})
	.then(function(md5){
		return pfs.mv(path, filestorepath + '/' + md5)
		.then(function(dst){
			return {path: dst, md5: md5}
		},function(err){
			fordelete.push(filestorepath + '/' + md5);
			return err;
		});
	})
	.then(function(res){
		return pfs.stat(res.path)
		.then(function(stats){
			data.path     = res.path,
			data.md5      = res.md5,
			data.filename = filename,
			data.mimetype = mimetype,
			data.size     = stats.size
			return data;
		});
	})
	.then(callback, c_err).catch(c_err);
};


exports.get=function(md5, callback, callback_err){
	var filestorepath = conf.filestore.path;
	if(md5 && md5.length==32){
		pfs.exists(filestorepath+'/'+md5)
		.then(function(isexist){
			if(!isexist){
				callback_err(env.error(104));
			}else{
				fs.readFile(filestorepath+'/'+md5, function (err, data) {
					if(err){
						callback_err(err);
					}else{
						callback(data);
					};
				});
			};
		}).catch(callback_err);
	}else{
		callback_err(env.error(109));
	};
};


/*
CREATE TABLE file (
  idfile SERIAL, 
  md5 VARCHAR(32), 
  mime VARCHAR(50), 
  filename VARCHAR, 
  CONSTRAINT files_idx UNIQUE(md5), 
  CONSTRAINT files_pkey PRIMARY KEY(idfile)
) WITHOUT OIDS;

CREATE SEQUENCE file_idfile_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;
  
*/
