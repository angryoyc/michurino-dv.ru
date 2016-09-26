#!/usr/local/bin/node
var env=require('../../modules/env');
var db = require('db');
var user_data = require('../user/data_ro').do;

// GO
exports.go = function(req, res){
	env.pvt_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};
	if(arg.iduser){
		user_data({iduser: arg.iduser}, callback, callback_err, idata);
	}else{
		data.iduser = null;
		data.username='';
		callback(data);
	};
};
