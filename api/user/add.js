#!/usr/local/bin/node

var env				= require('../../modules/env');
var db 				= require('db');
var user_data_ro	= require('../user/data_ro').do;
var myname 			= 'settv';
// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	var id = arg.id ||  0;
	var provider =  arg.provider || '';
	var md5pass =  arg.md5pass || '';
	var displayName = arg.displayName || arg.login || arg.username || '';
	displayName = displayName.replace(/ +/, ' ');
	var enabled = (provider!=myname);
	if(provider && displayName){
		// проверим пользователя на существование
		db.sql("select iduser from public.user where provider=$1 and username ilike $2;", [ provider, displayName ], function(result){
			if(result.rows.length>0){
				callback_err(env.error(110));
			}else{
				addnew(provider, id, displayName, md5pass, enabled, callback, callback_err, data);
			};
		}, callback_err);
	}else{
		callback_err(env.error(109));
	};
};

function addnew(provider, id, displayName, md5pass, enabled, callback, callback_err, idata){
	var data = idata || {};
	db.sql("insert into public.user (provider, id, username, md5pass, dt, enabled) values ($1, $2, $3, $4, now(), $5) returning iduser, provider, id, username;", [provider, id, displayName, md5pass, enabled], function(result){
		if(result && result.rows && result.rows.length && result.rows[0], result.rows[0].iduser>0){
			if( result.rows[0].id>0 && result.rows[0].provider!=myname ){
				// если id был указан, то вернём данные нового пользователя
				user_data_ro(result.rows[0], callback, callback_err, data);
			}else if( !(result.rows[0].id>0) && result.rows[0].provider==myname ){
				// если добавляется локальный пользователь, то в качестве id используем iduser
				db.sql("update public.user set id=iduser where iduser=$1 returning iduser;", [ result.rows[0].iduser ], function(result){
					// и вернём данные пользователя
					user_data_ro(result.rows[0], callback, callback_err, data);
				}, callback_err);
			}else{
				callback_err(env.error(109));
			};
		}else{
			callback_err(env.error(108));
		};
	}, callback_err);
};