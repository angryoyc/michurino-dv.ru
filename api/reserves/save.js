#!/usr/local/bin/node

var env			= require('../../modules/env');
var delivery	= require('delivery');
var cf			= require('cf');
var conf		= require('../../config.json');
var db			= require('db');
var async		= require('async');
var moment		= require('moment');


// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	data.idreserve= arg.idreserve?parseInt(arg.idreserve):0;
	data.idstead= arg.idstead?parseInt(arg.idstead):0;

	var fio    = cf.trim(arg.fio?arg.fio:'');
	var phone  = cf.trim(arg.phone?arg.phone:'');
	var note   = cf.trim(arg.note?arg.note:'');
	
	var from_dt = arg.from_dt?arg.from_dt:'';
	var to_dt = arg.to_dt?arg.to_dt:'';
	var contract_nom = arg.contract_nom?arg.contract_nom:'';
	var contract_date = arg.contract_date?arg.contract_date:'';
	var price = arg.price?parseInt(arg.price):0;

	from_dt = moment(cf.trim(from_dt));
	to_dt = moment(cf.trim(to_dt));
	contract_nom = cf.trim(contract_nom);
	contract_date = moment(cf.trim(contract_date));
	
	console.log(data);
	
	if(data.idstead>0){
		if(data.idreserve>0){
			update(fio, phone, note, from_dt, to_dt, contract_nom, contract_date, price, callback, callback_err, data)
		}else{
			db.sql('insert into m.reserves (idstead) values ($1) returning idreserve;', [data.idstead], function(result){
				if(result.rows.length>0){
					data.idreserve = result.rows[0].idreserve;
					update(fio, phone, note, from_dt, to_dt, contract_nom, contract_date, price, callback, callback_err, data)
				}else{
					callback_err(env.error(108));
				};
			}, callback_err);
		};
	}else{
		callback_err(env.error(109));
	}

};

function update(fio, phone, note, from_dt, to_dt, contract_nom, contract_date, price, callback, callback_err, idata){
	var data = idata || {};
	if(data.idreserve>0){
		async.parallel(
			[
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
					db.sql('update m.reserves set from_dt=$2::timestamp where idreserve=$1 returning from_dt;', [data.idreserve, from_dt.toDate()], function(result){
						if(result.rows.length>0) data.from_dt=result.rows[0].from_dt;
						cb();
					}, cb);
					
				},
				function(cb){
					db.sql('update m.reserves set to_dt=$2::timestamp where idreserve=$1 returning to_dt;', [data.idreserve, to_dt.toDate()], function(result){
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
					db.sql('update m.reserves set contract_date=$2::date where idreserve=$1 returning contract_date;', [data.idreserve, contract_date.toDate()], function(result){
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
					callback(data);
				}
			}
		);
	}else{
		callback_err(env.error(109));
	};
}
