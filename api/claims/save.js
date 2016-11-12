#!/usr/local/bin/node

var env			= require('../../modules/env');
var delivery	= require('delivery');
var cf			= require('cf');
var conf		= require('../../config.json');
var db			= require('db');
var async		= require('async');


// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	data.idclaim= arg.idclaim?parseInt(arg.idclaim):0;
	var alias  = cf.trim(arg.alias?arg.alias:'');
	var phone  = cf.trim(arg.phone?arg.phone:'');
	var note   = cf.trim(arg.note?arg.note:'');

	if(data.idclaim){
		async.parallel(
			[
				function(cb){
					db.sql('update m.claims set alias=$2 where idclaim=$1 returning alias;', [data.idclaim, alias], function(result){
						if(result.rows.length>0) data.alias=result.rows[0].alias;
						cb();
					}, cb);
					
				},
				function(cb){
					db.sql('update m.claims set phone=$2 where idclaim=$1 returning phone;', [data.idclaim, phone], function(result){
						if(result.rows.length>0) data.phone=result.rows[0].phone;
						cb();
					}, cb);
					
				},
				function(cb){
					db.sql('update m.claims set note=$2 where idclaim=$1 returning note;', [data.idclaim, note], function(result){
						if(result.rows.length>0) data.note=result.rows[0].note;
						cb();
					}, cb);
					
				}
			],
			function(err){
				if(err){callback_err(err)}else{
					callback(data);
				}
			}
		);
	}else{
		callback_err(env.error(109));
	}
};

