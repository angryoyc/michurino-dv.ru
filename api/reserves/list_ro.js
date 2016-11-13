#!/usr/local/bin/node

var env=require('../../modules/env');
var db = require('db');
var cf = require('cf');
var moment = require('moment');
//var async = require('async');

// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	var idstead = arg.idstead?parseInt(arg.idstead):0;
	var fio = arg.fio?arg.fio:'';
	var phone = arg.phone?arg.phone:'';

	fio = cf.trim(fio.replace(/ +/g,' '));
	phone = cf.trim(phone).replace(/ /g,'').replace(/\-/g,'').replace(/\(/g,'').replace(/\)/g,'');

	var sql = 
"select \
	reserves.idreserve, \
	reserves.idstead, \
	reserves.type, \
	reserves.fio, \
	reserves.phone, \
	reserves.note, \
	to_char(reserves.from_dt, 'YYYY-MM-DD HH24:MI') as from_dt, \
	to_char(reserves.to_dt, 'YYYY-MM-DD HH24:MI') as to_dt, \
	reserves.contract_nom, \
	to_char(reserves.contract_date, 'YYYY-MM-DD') as contract_date, \
	reserves.price, \
	steads.pp \
from \
	m.reserves \
	left join m.steads on steads.idstead=reserves.idstead \
";
	var values = [];
	var where = [];

	if(idstead>0){
		values.push(idstead);
		where.push('reserves.idstead=$' + values.length);
	};

	if(fio.length>0){
		values.push(fio);
		where.push("(reserves.fio ilike '%' || $" + values.length + " || '%')" );
	};

	if(phone.length>0){
		values.push(phone);
		where.push("(reserves.phone ilike '%' || $" + values.length + " || '%')" );
	};

	sql = sql + ((where.length>0)? ' where ' + where.join(' and '): '') + ' order by idreserve desc limit 300;'

	//-	console.log(sql);

	db.sql(sql, values, function(result){
		data.rows = result.rows;
		callback(data);
	}, callback_err)

};
