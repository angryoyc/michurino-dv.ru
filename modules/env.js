var env={};
//- env.conf=require("../config.json");

//var async=require('async');
//var util=require('util');

var cf = require('cf');

/*
var db = require('db');
env.sql=function(sql, values, onok, onerr){
	db.sql(
		sql, 
		values, 
		function(result){
			onok(result);
		},
		function(err){
			err.number=103;
			err.sql=sql;
			err.values=values;
			if(typeof(onerr)=='function'){
				onerr(err);
			};
		}
	);
};
*/

// вызов аналогичен std_go за исключением того, что добавлена проверка на iduser (должен соответствовать пользователю в сессии, или пользователь в сесси должен иметь админовские права - 32)
// если iduser не указан, то он берется из сесии
env.pvt_go=function(req, res, do_routine, rights){
	var rght = rights || 0;
	req.body.iduser = req.body.iduser || 0;

	if(req && req.user && !req.body.user) {
		req.body.user = req.user;
		user_rght = req.user.rights;
	}else{
		user_rght = 0;
	};

	var iduser_sess = cf.isObject(req.body.user)?parseInt(req.body.user.iduser):0;
	if(req.body.iduser>0){ // если в запросе указан iduser
		if(iduser_sess!=req.body.iduser){
			//- console.log('Редактируем другого пользователя')
			env.std_go(req, res, do_routine, (rght | 3)); // то требуем права на доступ к админке и права менять пользователей
		}else{
			//-console.log('Редактируем себя', rght)
			env.std_go(req, res, do_routine, rght); // инчае не требуем (iduser будет браться из сессии)
		};
	}else{
		req.body.iduser = iduser_sess;
		env.std_go(req, res, do_routine, rght); // инчае не требуем (iduser будет браться из сессии)
	};
};

env.std_go=function(req, res, do_routine, rights){
	var startat = new Date();
	var result={};
	var rght = parseInt(rights) || 0;
	var	user_rght;
	var ret = {};

	if(req && req.user) {
		req.body.user = req.user;
		user_rght = req.user.rights;
	}else{
		user_rght = 0;
	};

	if(req && req.session) {
		req.body.session = req.session;
	};


	if((user_rght & rght) == rght){
		do_routine(
			req.body,
			function(result, mimetype){
				if((!mimetype) || (mimetype.match(/^application\/json/))){
					if(result){
						ret.error	= 0;
						ret.message	= 'Ok';
						ret.data=result;
						ret.data.elapsed = (new Date() - startat);
					};
					env.json_callback(res, ret, mimetype);
				}else{
					env.json_callback(res, result, mimetype);
				}
			},
			function(err){
				env.callback_err(err, ret);
				env.json_callback(res, ret);
			}
/*
			req.body,
			function(result){
				if(result){
					ret.error	= 0;
					ret.message	= 'Ok';
					ret.data=result;
					ret.data.elapsed = (new Date() - startat);
				};
				env.json_callback(res, ret);
			},
			function(err){
				env.callback_err(err, ret);
				env.json_callback(res, ret);
			}
*/
		);
	}else{
		console.log('Недостаточный уровень доступа!!!');
		console.log('есть:', user_rght, ' надоть: ', rght);
		ret.message	= 'Access denied';
		ret.error	= 113;
		console.log(ret.message.error, ' [' + ret.error + ']');
		env.json_callback(res, ret);
	};
};


env.json_callback=function(res, ret, mimetype){
	var mime = mimetype || "application/json; charset=utf-8"
	res.header("Content-Type", mime);
	res.header("Access-Control-Allow-Origin", "*");
	res.send(ret);
};

/*
env.json_callback=function(res, ret){
	res.header("Content-Type", "application/json; charset=utf-8");
	res.header("Access-Control-Allow-Origin", "*");
	res.send(ret);
};
*/

env.callback_err=function(err, ret){
	var k;
	if(ret){
		ret.error = err.number;
		ret.message = err.message;
	};
	console.log(err.name.error, ' [' + err.number + '] ' + err.message);
	for(k in err){
		if(k && k!='number' && k!='message' && k!='name'){
			console.log(k +':',  err[k]);
		};
	};
};

env.error=function(errorNumber, arg, additions){
	if(typeof(errors[errorNumber])=='string'){
		//err.error=errorNumber;
		var err_message=errors[errorNumber];
		if(arg && cf.isArray(arg)){
			for(var i=0; i<arg.length; i++){
				var pt='{'+(i+1)+'}';
				err_message=err_message.replace(pt, arg[i]);
			};
		};
		var re = /\{\d+\}/g;
		err_message.replace(re,'');
		var err = new Error(err_message);
		err.number=errorNumber;
		if(cf.isObject(additions)){
			cf.mergeInto(err, additions)
		};
		return err;
	}else{
		var err = new Error(errors[105]);
		err.number=105;
		return err;
	};
};

env.callback=function(err, callback, callback_err, data){
	if(err){
		if(typeof(callback_err)=='function'){
			callback_err(err);
		}else{
			callback(err);
		};
	}else{
		callback(data || undefined);
	};
};

var errors={
	0: 'Ok',
	100: '{1}',
	101: 'Handler not found',
	102: 'Problem with DB access',
	103: 'Error in SQL:"{1}" Message: "{2}"',
	104: 'Not found :: {1}',
	105: 'Unknown error: {1}',
	106: 'Not found',
	107: 'Inconsistent data: {1}',
	108: 'Unable to add record: {1}',
	109: 'Empty incoming data',
	110: 'Value already present',
	111: 'Operation not permit :: {1}',
	113: 'Access denied',
	114: 'Unable to delete record - linked data present',
	115: 'Unable to update record',
	116: 'Value already taken',
	117: 'Disabled',
	118: 'Invalid password',
	119: 'Not ready method'
};

module.exports=env;
