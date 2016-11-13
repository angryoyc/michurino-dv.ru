#!/usr/local/bin/node

var env			= require('../../modules/env');
var delivery	= require('delivery');
var cf			= require('cf');
var conf		= require('../../config.json');
var db			= require('db');
var async		= require('async');
var moment		= require('moment');
var api_stead_calc_status = require('../stead/calc_status').do;


// GO
exports.go = function(req, res){
	env.pvt_go(req, res, exports.do, (1+32));
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	data.idreserve = arg.idreserve?parseInt(arg.idreserve):0;
	data.idstead = arg.idstead?parseInt(arg.idstead):0;
	data.iduser = arg.iduser?parseInt(arg.iduser):0;

	var fio    = cf.trim(arg.fio?arg.fio:'');
	var type    = cf.trim(arg.type?arg.type:'');
	var phone  = cf.trim(arg.phone?arg.phone:'');
	var note   = cf.trim(arg.note?arg.note:'');
	
	var from_dt = arg.from_dt?arg.from_dt:'';
	var to_dt = arg.to_dt?arg.to_dt:null;
	var contract_nom = arg.contract_nom?arg.contract_nom:'';
	var contract_date = arg.contract_date?arg.contract_date:'';
	var price = arg.price?parseInt(arg.price):0;

	from_dt = moment(cf.trim(from_dt));
	to_dt = (to_dt==null)?null:moment(cf.trim(to_dt));
	contract_nom = cf.trim(contract_nom);
	contract_date = moment(cf.trim(contract_date));

	if(data.idstead>0){
		test_interval(data.idreserve, data.idstead, from_dt, to_dt, function(result){
			if(data.idreserve>0){
				update(data.iduser, type, fio, phone, note, from_dt, to_dt, contract_nom, contract_date, price, callback, callback_err, data)
			}else{
				db.sql('insert into m.reserves (idstead) values ($1) returning idreserve;', [data.idstead], function(result){
					if(result.rows.length>0){
						data.idreserve = result.rows[0].idreserve;
						update(data.iduser, type, fio, phone, note, from_dt, to_dt, contract_nom, contract_date, price, callback, callback_err, data);
					}else{
						callback_err(env.error(108));
					};
				}, callback_err);
			};
		}, callback_err);
	}else{
		callback_err(env.error(109));
	}

};

function update(iduser, type, fio, phone, note, from_dt, to_dt, contract_nom, contract_date, price, callback, callback_err, idata){
	var data = idata || {};
	if(data.idreserve>0){
		async.parallel(
			[
				function(cb){
					db.sql('select pp from m.steads where idstead=$1;', [data.idstead], function(result){
						if(result.rows.length>0) data.pp = result.rows[0].pp;
						cb();
					}, cb);
					
				},
				function(cb){
					db.sql('update m.reserves set type=$2 where idreserve=$1 returning type;', [data.idreserve, type], function(result){
						if(result.rows.length>0) data.type = result.rows[0].type;
						cb();
					}, cb);
					
				},
				function(cb){
					db.sql('update m.reserves set fio=$2 where idreserve=$1 returning fio;', [data.idreserve, fio], function(result){
						if(result.rows.length>0) data.fio=result.rows[0].fio;
						cb();
					}, cb);
					
				},
				function(cb){
					db.sql('update m.reserves set phone=$2 where idreserve=$1 returning phone;', [data.idreserve, phone], function(result){
						if(result.rows.length>0) data.phone=result.rows[0].phone;
						cb();
					}, cb);
					
				},
				function(cb){
					db.sql('update m.reserves set note=$2 where idreserve=$1 returning note;', [data.idreserve, note], function(result){
						if(result.rows.length>0) data.note=result.rows[0].note;
						cb();
					}, cb);
					
				},
				function(cb){
					db.sql("update m.reserves set from_dt=$2::timestamp where idreserve=$1 returning to_char(reserves.from_dt, 'YYYY-MM-DD HH24:MI') as from_dt;", [data.idreserve, from_dt.toDate()], function(result){
						if(result.rows.length>0) data.from_dt=result.rows[0].from_dt;
						cb();
					}, cb);
					
				},
				function(cb){
					db.sql("update m.reserves set to_dt=$2::timestamp where idreserve=$1 returning to_char(reserves.to_dt, 'YYYY-MM-DD HH24:MI') as to_dt;", [data.idreserve, (to_dt==null)?null:to_dt.toDate()], function(result){
						if(result.rows.length>0) data.to_dt=result.rows[0].to_dt;
						cb();
					}, cb);
					
				},
				function(cb){
					db.sql('update m.reserves set contract_nom=$2 where idreserve=$1 returning contract_nom;', [data.idreserve, contract_nom], function(result){
						if(result.rows.length>0) data.contract_nom=result.rows[0].contract_nom;
						cb();
					}, cb);
					
				},
				function(cb){
					db.sql("update m.reserves set contract_date=$2::date where idreserve=$1 returning to_char(reserves.contract_date, 'YYYY-MM-DD') as contract_date;", [data.idreserve, contract_date.toDate()], function(result){
						if(result.rows.length>0) data.contract_date=result.rows[0].contract_date;
						cb();
					}, cb);
					
				},
				function(cb){
					db.sql('update m.reserves set price=$2 where idreserve=$1 returning price;', [data.idreserve, price], function(result){
						if(result.rows.length>0) data.price=result.rows[0].price;
						cb();
					}, cb);
					
				}
			],
			function(err){
				if(err){callback_err(err)}else{
					api_stead_calc_status({idstead:data.idstead, iduser: iduser}, function(){
						callback(data);
					}, callback_err);
					
				}
			}
		);
	}else{
		callback_err(env.error(109));
	};
}


function test_interval(idreserve, idstead, from_dt, to_dt, callback, callback_err){
	var sql = 'select * from m.reserves where (($2::timestamptz is null) or (from_dt<$2)) and ((to_dt is null) or (to_dt>$1)) and idstead=$3';
	var values = [from_dt.toDate(), (to_dt==null)?null:to_dt.toDate(), idstead];
	if(idreserve>0){
		values.push(idreserve);
		sql=sql + ' and idreserve!=$' + values.length;
	};
	db.sql(sql, values, function(result){
		if( result.rows.length>0 ){
			callback_err(env.error(110));
		}else{
			callback();
		}
	}, callback_err);
};