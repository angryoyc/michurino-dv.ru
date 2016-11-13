#!/usr/local/bin/node

var env=require('../../modules/env');
var db = require('db');
//var cf = require('cf');
var api_stead_calc_status = require('../stead/calc_status').do;

// GO
exports.go = function(req, res){
	env.pvt_go(req, res, exports.do, (1+32));
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	var idreserve = arg.idreserve?parseInt(arg.idreserve):0;

	if(idreserve>0){
		var values = [idreserve];
		db.sql('select idstead from m.reserves where idreserve=$1;', values, function(result){
			if(result.rows.length>0){
				var idstead = result.rows[0].idstead;
				db.sql('delete from m.reserves where idreserve=$1;', values, function(result){
					data.deleted=true;
					api_stead_calc_status({idstead:idstead, iduser: arg.iduser}, function(result){
						callback(data);
					}, callback_err);
				}, callback_err);
			}else{
				callback_err(env.error(104, [idreserve]));
			};
		}, callback_err);
	}else{
		callback_err(env.error(109));
	};

};
