#!/usr/local/bin/node

var env				= require('../../modules/env');
var db 				= require('db');
var async 				= require('async');
var user_data_ro	= require('../user/data_ro').do;
var myname 			= 'settv';


// менять права и вкл/выкл можно только если у пользователя под которым выполняется запрос есть права 3 (доступ к админке и право менять пользователей)
// менять пароль можно и без прав, но только для себя

// GO
exports.go = function(req, res){
	env.pvt_go(req, res, exports.do, 0);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	var md5pass = arg.md5pass || '';
	var iduser  = arg.iduser?parseInt(arg.iduser):0;
	var rights  = arg.rights?parseInt(arg.rights):0;
	var enabled = arg.enabled?true:false;

	if(iduser){
		// проверим пользователя на существование
		db.sql("select * from public.user where iduser=$1;", [ iduser ], function(result){
			if(result.rows.length>0){
				var user = result.rows[0];
				async.parallel(
					[
						function(cb){
							if((arg.user.rights & 3)==3){
								db.sql("update public.user set enabled=$2, rights=$3 where iduser=$1;", [ user.iduser, enabled, rights ], function(result){
									cb();
								}, cb);
							}else{
								cb(env.error(113));
							};
						},
						function(cb){
							if(md5pass){
								db.sql("update public.user set md5pass=$2 where iduser=$1;", [ user.iduser, md5pass ], function(result){
									cb();
								}, cb);
							}else{
								cb();
							};
						}
					],
					function(err){
						if(err){callback_err(err)}else{
							// и вернём данные пользователя
							user_data_ro(user, callback, callback_err, data);
						};
					}
				);
			}else{
				callback_err(env.error(104));
			};
		}, callback_err);
	}else{
		callback_err(env.error(109));
	};
};

