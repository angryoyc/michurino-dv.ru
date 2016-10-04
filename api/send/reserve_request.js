#!/usr/local/bin/node

var env				= require('../../modules/env');
var delivery		= require('delivery');
var cf				= require('cf');
var conf			= require('../../config.json');


// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	var phone  = arg.phone?arg.phone:'';
	var pp  = arg.pp?parseInt(arg.pp):0;

	var text = 'Поступил запрос на бронирование участка #' + pp + '. Был указан телефон: ' + phone;
	if(phone){
		var emailconf = conf.email[conf.email.checked];
		delivery.mail.send({to: emailconf.user, subj: 'Запос с сайта MICHURINO-DV.RU', text: text}, emailconf, 0, function(result){
			cf.mergeInto(data, result);
			callback(data);
		}, callback_err);
	}else{
		data.message='Телефон не указан'
		callback(data);
	};
};

