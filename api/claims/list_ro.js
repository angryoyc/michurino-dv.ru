#!/usr/local/bin/node

var env=require('../../modules/env');
var db = require('db');
var cf = require('cf');
//var async = require('async');

// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	var idstead = arg.idstead?parseInt(arg.idstead):0;
	var alias = arg.alias?arg.alias:'';
	var fio = arg.fio?arg.fio:'';
	var phone = arg.phone?arg.phone:'';

	fio = cf.trim(fio.replace(/ +/g,' '));
	alias = cf.trim(alias.replace(/ +/g,' '));
	phone = cf.trim(phone).replace(/ /g,'').replace(/\-/g,'').replace(/\(/g,'').replace(/\)/g,'');


	var sql = 'select claims.*, steads.pp from m.claims left join m.steads on steads.idstead=claims.idstead ';
	var values = [];
	var where = [];

	if(idstead>0){
		values.push(idstead);
		where.push('claims.idstead=$' + values.length);
	};

	if(alias.length>0){
		values.push(alias);
		where.push("(claims.alias ilike '%' || $" + values.length + " || '%')" );
	};

	if(fio.length>0){
		values.push(fio);
		where.push("(claims.fio ilike '%' || $" + values.length + " || '%')" );
	};

	if(phone.length>0){
		values.push(phone);
		where.push("(claims.phone ilike '%' || $" + values.length + " || '%')" );
	};

	sql = sql + ((where.length>0)? ' where ' + where.join(' and '): '') + ' order by dt desc limit 300;'

	console.log(sql);

	db.sql(sql, values, function(result){
		data.rows = result.rows;
		callback(data);
	}, callback_err)

};
