#!/usr/local/bin/node

var env				= require('../../modules/env');
var db 				= require('db');
var async 				= require('async');
var stead_data_ro	= require('../stead/data_ro').do;


// GO
exports.go = function(req, res){
	env.pvt_go(req, res, exports.do, 4);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	var idstead = arg.idstead?parseInt(arg.idstead):0;
	var status = arg.status?arg.status:'';
	var points = arg.points?arg.points:'';
	var start = arg.start?arg.start:'';
	var price = arg.price?parseInt(arg.price):0;
	var cost = 550;

	if(idstead){
		// проверим пользователя на существование
		db.sql("select * from m.params where param='cost';", [ ], function(result){
			if(result.rows.length>0){
				cost=parseInt(result.rows[0].val);
			};
			db.sql("select * from m.steads where idstead=$1;", [ idstead ], function(result){
				if(result.rows.length>0){
					var stead = result.rows[0];
					async.parallel(
						[
						/*
							function(cb){
								db.sql("update m.steads set status=$2 where idstead=$1;", [ stead.idstead, status], function(result){
									cb();
								}, cb);
							},
						*/
							function(cb){
								db.sql("update m.steads set points=$2 where idstead=$1;", [ stead.idstead, points], function(result){
									cb();
								}, cb);
							},
							function(cb){
								db.sql("update m.steads set start=$2 where idstead=$1;", [ stead.idstead, start], function(result){
									cb();
								}, cb);
							},
							function(cb){
								db.sql("update m.steads set price=$2 where idstead=$1 returning idstead, price, s;", [ stead.idstead, 1*price], function(result){
									var k = 1 * result.rows[0].price/(1 * result.rows[0].s * cost);
									db.sql("update m.steads set k=$2 where idstead=$1 returning idstead, k;", [ stead.idstead, k], function(result){
										cb();
									}, cb);
								}, cb);
							}
						],
						function(err){
							if(err){callback_err(err)}else{
								// и вернём данные пользователя
								stead_data_ro(stead, callback, callback_err, data);
							};
						}
					);
				}else{
					callback_err(env.error(104));
				};
			}, callback_err);
		}, callback_err);
	}else{
		callback_err(env.error(109));
	};
};

