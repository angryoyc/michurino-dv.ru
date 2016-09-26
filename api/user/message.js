#!/usr/local/bin/node

var env=require('../../modules/env');
var cf=require('cf');
var delivery=require('delivery');

//var mail=require('../user/mail');
//var sms=require('../user/sms');
var conf=require('../../config.json');

var async=require('async');


// GO
exports.go = function(req, res){
	env.pvt_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	if(typeof(arg.message)=='string' && arg.message.length>0){
		arg.iduser=parseInt(arg.iduser) || 0;
		if(arg.iduser>0){                                                                                             // iduser определён
			sendMess(arg, callback, callback_err, data);
		}else{
			callback_err(env.error(109));
		};
	}else{
		callback_err(env.error(109));
	}
};

function sendMess(arg, callback, callback_err, idata){
	var data = idata || {};

	//env.sql('select contact, idtype from fr.contact where iduser=$1 and state=1 order by idtype desc limit 1', [arg.iduser], function(result){
	cap({}, function(result){ // эту строчку потом удалить а предыдущую раскомментировать
		if(result.rows.length>0){
			var contact = result.rows[0];
			if(contact.idtype==1){
				// Phone
				//sms.send(env, {phone: contact.contact, text: arg.message}, data, callback, callback_err);
				delivery.sms.send({to: contact.contact, text: arg.message, subj: 'Оповещение от '+ conf.name}, conf.SMS[conf.SMS.checked], 3)
				.then(
					function(){
						console.log('ok');
					},
					function(err){
						console.log('err', err);
					}
				);
				callback(data);
				
			}else if(contact.idtype==2){
				// mail
				//env.mail({to: contact.contact, text: arg.message, subj: 'Оповещение от '+ env.conf.name});
				delivery.mail.send({to: contact.contact, text: arg.message, subj: 'Оповещение от '+ conf.name}, conf.email[conf.email.checked], 3, function(){
					callback(data);
				}, callback_err, data)
				
			}else{
				callback(data);
			};
		}else{
			callback_err(env.error(104, ['iduser='+arg.iduser]));
		};
	}, callback_err);
};

// заглушка. Опосля удалить
function cap(arg, callback, callback_err){
	callback({rows:[{
		contact: '+79098704723',
		idtype:1
	}]});
}