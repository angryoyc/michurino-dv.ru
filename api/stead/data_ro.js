#!/usr/local/bin/node
"use strict";

var env=require('../../modules/env');
var cf=require('cf');
var db = require('db');


// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};
	var idstead = arg.idstead?parseInt(arg.idstead):0;
	db.sql('select * from m.steads where idstead=$1;', [idstead], function(result){
		if(result.rows.length>0){
			cf.mergeInto(data, result.rows[0]);
			callback(data);
		}else{
			callback_err(env.error(104));
		}
	}, callback_err);

};

