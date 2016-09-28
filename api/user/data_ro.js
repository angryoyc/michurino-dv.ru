#!/usr/local/bin/node
"use strict";

var env=require('../../modules/env');
var cf=require('cf');
var crypto = require('crypto');
var db = require('db');

var sql1="select * from m.users where provider=$1 and id=$2";
var sql2="select * from m.users where username ilike $1";
var sql3="select * from m.users where iduser=$1";

// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};
	var id;
	var sql='';
	var values = [];

/*
	// если хотим получить все ошибки в консоли
	callback_err = (function(cb){
		return function(err){
			console.log(err);
			if(typeof(cb)=='function') cb(err);
		};
	})(callback_err);
*/

	var something = arg.something || '';
	// Проверим, возможно пользователь определен явно
	if(arg.iduser){ //через iduser
		values.push(arg.iduser);
		sql=sql3;
	}else{
		if(arg.id && arg.provider && arg.provider.length>0){ // или через  id и название провайдера
			values.push(arg.provider, arg.id);
			sql=sql1;
		};
	};

	// Если не определён явно
	if(!(values.length>0)){
		if(
			(arg.username && arg.password && something)
			&&
			(arg.username.length>0 && arg.password.length>0 && something.length>0)
		){// но есть имя пользователя, пароль и something
			sql=sql2; // то будем пытаться определить пользователя через  них
		values.push(arg.username);
		};
	}
	if(sql.length>0){
		db.sql(sql, values, function(result){
			if(!(result.rows.length>0)){
				callback_err(env.error(104, [values[0]]))
			}else{
				if((sql==sql1) || (sql==sql3)){ // если был определён явно
					loadProfile(result.rows[0], callback, callback_err, data);
				}else{ // если определяли через username
					//- console.log('// fr_user_ro: если определяли через username', something, result.rows[0].md5pass);
					
					if(arg.password == cf.md5(something+result.rows[0].md5pass)){ 
						// console.log('password OK');
						loadProfile(result.rows[0], callback, callback_err, data);
					}else{
						callback_err(env.error(118,[]));
					};
				};
			};
		}, callback_err);
	}else{
		callback_err(env.error(107,['id='+arg.id+' '+'provider='+arg.provider+' ' + 'username='+arg.username+' ']));
	};
};


// Коррекция дата перед возвращением
function loadProfile(arg, callback, callback_err, idata){
	var data = idata || {};
	cf.mergeInto(data, arg);
	data.rights=1*(data.rights || 0);
	delete(data.md5pass);
	callback(data);
};

