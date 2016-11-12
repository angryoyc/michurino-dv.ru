#!/usr/local/bin/node

var env				= require('../../modules/env');
var delivery		= require('delivery');
var cf				= require('cf');
var conf			= require('../../config.json');
var db				= require('db');


// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	var phone  = arg.phone?arg.phone:'';
	var alias  = arg.alias?arg.alias:'';
	var pp  = arg.pp?parseInt(arg.pp):0;

	var text = 'Поступил запрос на бронирование участка #' + pp + '. Были указаны: \nтелефон: ' + phone + '\nИмя для обращения: ' + alias;
	if(phone){
		db.sql('select idstead from m.steads where pp=$1;', [pp], function(result){
			var idstead = (result.rows.length>0)? result.rows[0].idstead : null;
			db.sql('insert into m.claims (dt, phone, alias, idstead) values (now()::timestamp, $1, $2, $3 ) returning *;', [phone, alias, idstead], function(result){
				var emailconf = conf.email[conf.email.checked];
				delivery.mail.send({to: emailconf.user, subj: 'Запрос с сайта MICHURINO-DV.RU', text: text}, emailconf, 0, function(result){
					cf.mergeInto(data, result);
					callback(data);
				}, callback_err);
			}, callback_err);
		}, callback_err);
	}else{
		data.message='Телефон не указан'
		callback(data);
	};
};

