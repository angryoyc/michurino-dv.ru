#!/usr/local/bin/node
"use strict";

var env=require('../../modules/env');
//var cf=require('cf');
var db = require('db');
var async = require('async');


// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};
	var sql='';
	var values = [];
	async.parallel(
		[
//			function(cb){
//				db.sql('select count(*) as c from steads;', [], function(result){
//					data.steads_counter = result.rows[0].c;
//					cb();
//				}, cb);
//			},
			function(cb){
				db.sql('select count(*) as c from public.user where enabled=true;', [], function(result){
					data.users_enabled_counter = result.rows[0].c;
					cb();
				}, cb);
			},
			function(cb){
				db.sql('select count(*) as c from public.user where enabled=false;', [], function(result){
					data.users_disabled_counter = result.rows[0].c;
					cb();
				}, cb);
			},
			function(cb){
				db.sql('select count(*) as c from public.product;', [], function(result){
					data.product_counter = result.rows[0].c;
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
};
