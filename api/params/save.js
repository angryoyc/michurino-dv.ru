#!/usr/local/bin/node

var env=require('../../modules/env');
var db = require('db');

// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};


	data.idparam  = arg.idparam?parseInt(arg.idparam):0;
	data.val = arg.val || '';

	db.sql('update m.params set val=$2 where idparam=$1 returning *;', [data.idparam, data.val], function(result){
		data.val=result.rows[0].val;
		if(result.rows[0].param=='cost'){
			var cost = parseInt(data.val);
			db.sql('update m.steads set price=(s*$1*k)::integer;', [cost], function(result){
				callback(data);
			}, callback_err);
		}else{
			callback(data);
		};
	}, callback_err);



};

