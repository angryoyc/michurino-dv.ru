#!/usr/local/bin/node

var env				= require('../../modules/env');
var db 				= require('db');
var async 				= require('async');
var api_stead_calc_status	= require('../stead/calc_status').do;


// GO
exports.go = function(req, res){
	env.pvt_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};
	data.total = 0;
	db.sql("select * from m.steads order by pp;", [], function(result){
		async.forEachLimit(
			result.rows, 1,
			function(row, cb){
				api_stead_calc_status({idstead: row.idstead, iduser: arg.iduser}, function(result){
					if(result.changed) data.total++;
					cb();
				}, callback_err)
			},
			function(err){
				if(err){callback_err(err)}else{
					callback(data);
				}
			}
		);
	}, callback_err);
};

