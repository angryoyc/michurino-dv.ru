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

	var iduser  = arg.iduser?parseInt(arg.iduser):0;

	if(iduser){
		// проверим пользователя на существование
		db.sql("select * from m.users where iduser=$1;", [ iduser ], function(result){
			if(result.rows.length>0){
				var user = result.rows[0];
				async.parallel(
					[
						function(cb){
							data.linked_cmmnt = 0;
							cb();
							/*
							db.sql("select count(idcmmnt) as c from cmmnt where iduser=$1;", [ user.iduser ], function(result){
								data.linked_cmmnt = result.rows[0].c;
								cb();
							}, cb);
							*/
						}
					],
					function(err){
						if(err){callback_err(err)}else{
							if(data.linked_cmmnt>0){
								// если есть связанные элементы, то вернём фигу
								data.deleted = false;
								callback(data);
							}else{
								// пользователь гол как сокол, можно смело удалять. Удаляем.
								db.sql("delete from m.users where iduser=$1;", [ user.iduser ], function(){
									data.deleted = true;
									callback(data);
								}, callback_err);
							};
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
