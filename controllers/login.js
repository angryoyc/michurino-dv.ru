var param=require('../modules/param');
var cf=require('cf');
var conf=require('../config.json');

module.exports = {
	main: function(req, res){
		var err_num=param(req, 'err', 0, false);
		var message;
		var username;
		if(err_num==0){
			message='';
		}else if(err_num==1){
			message = 'Неверный пароль. Повторите ввод или попробуйти войти через другой сервис.';
			username = param(req, 'username', '', false);
		};
		res.render('login/main', {ng_app: 'login', message:message, username: username, conf:conf, req:req});
	},

	form: function(req, res){
		var something=req.session.something=cf.getRandomString(32);
		res.render('login/form', {ng_app: 'login', something: something, conf:conf});
	},

	auth: function(req, res){
		res.render('login/auth', {ng_app: 'login'});
	},

	registration: function(req, res){
		res.render('login/registration', {ng_app: 'login'});
	},

	restore: function(req, res){
		res.render('login/restore', {ng_app: 'login'});
	},

	error: function(req, res){
		res.render('login/error', {ng_app: 'login'});
	}
};

