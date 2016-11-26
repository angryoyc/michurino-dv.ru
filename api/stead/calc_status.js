#!/usr/local/bin/node

var env				= require('../../modules/env');
var db 				= require('db');
var delivery		= require('delivery');
var conf			= require('../../config.json');
//var async 				= require('async');


// GO
exports.go = function(req, res){
	env.pvt_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	var idstead = arg.idstead?parseInt(arg.idstead):0;

	if(idstead){
		db.sql("select * from m.steads where idstead=$1;", [ idstead ], function(result){
			var st=result.rows[0];
			if(result.rows.length>0){
				var status='free';
				db.sql("select * from m.reserves where idstead=$1 and (from_dt<$2::timestamptz) and ((to_dt>$2::timestamptz) or (to_dt is null)) order by idreserve desc;", [ idstead , new Date() ], function(result){

					if(result.rows.length>0){
						status=result.rows[0].type;
					};

					if(status!=st.status){
						getUsername(arg.iduser, function(username){
							var text = 'Статус участка №' + idstead + ' изменён! [' + trans(st.status) + ' --> ' + trans(status) + ']\nПользователь: ' + username;
							console.log('статус участка изменён');
							db.sql("update m.steads set status=$2 where idstead=$1;", [ idstead, status ], function(result){
								var emailconf = conf.email[conf.email.checked];
								delivery.mail.send({to: emailconf.user, subj: 'Сообщение с сайта MICHURINO-DV.RU', text: text}, emailconf, 2);
								data.changed=true;
								callback(data);
							}, callback_err);
						}, callback_err);
					}else{
						callback(data);
					};
				}, callback_err)
			}else{
				callback_err(env.error(104));
			};
		}, callback_err);
	}else{
		callback_err(env.error(109));
	};
};


function trans(s){
	if(s=='sold'){
		return 'Продан';
	}else if(s=='free'){
		return 'Свободен';
	}else if(s=='reserved'){
		return 'Забронирован';
	}else{
		return 'неизвестный';
	};
}

function getUsername(iduser, callback, callback_err){
	if(iduser>0){
		db.sql("select username from m.users where iduser=$1;", [ iduser ], function(result){
			if(result.rows.length>0){
				callback(result.rows[0].username);
			}else{
				callback('неизвестный (' + iduser +')');
			};
		}, callback_err);
	}else{
		callback('Система');
	};
};