var FacebookStrategy = require('passport-facebook').Strategy;
var VkontakteStrategy = require('passport-vkontakte').Strategy;
var OdnoklassnikiStrategy = require('passport-odnoklassniki').Strategy;
var LocalStrategy = require('passport-local').Strategy;
//-var util=require('util');
var conf = require('../config.json');
var user_data_ro = require('../api/user/data_ro').do
var user_add = require('../api/user/add').do

module.exports=function(){
	var passport = require('passport');
	if(conf.auth && conf.auth.facebook) passport.use(
		new FacebookStrategy(
			{
				clientID: conf.auth.facebook.app_id,
				clientSecret: conf.auth.facebook.app_secret,
				callbackURL: "http://"+conf.name+"/auth/fb/callback",
				profileFields: ['id', 'displayName', 'photos']
			},
			function(accessToken, refreshToken, profile, done) {
				process.nextTick(
					function () {
						return done(null, profile);
					}
				);
			}
		)
	);

	if(conf.auth && conf.auth.vkontakte) passport.use(
		new VkontakteStrategy(
			{
				clientID: conf.auth.vkontakte.app_id,
				clientSecret: conf.auth.vkontakte.app_secret,
				callbackURL: "http://"+conf.name+"/auth/vk/callback",
				profileFields: ['id', 'displayName', 'photos']
			},
			function(accessToken, refreshToken, profile, done) {
				process.nextTick(
					function () {
						return done(null, profile);
					}
				);
			}
		)
	);

	if(conf.auth && conf.auth.odnoklassniki) passport.use(
		new OdnoklassnikiStrategy(
			{
				clientID: conf.auth.odnoklassniki.app_id,
				clientPublic: conf.auth.odnoklassniki.app_public,
				clientSecret: conf.auth.odnoklassniki.app_secret,
				callbackURL: "http://"+conf.name+"/auth/ok/callback",
				profileFields: ['id', 'displayName', 'photos']
			},
			function(accessToken, refreshToken, profile, done) {
				process.nextTick(
					function () {
						return done(null, profile);
					}
				);
			}
		)
	);

	passport.use(
		new LocalStrategy(
			{passReqToCallback: true},
			function(req, username, password, done) {
				getLocalUserByNamePass(username, password, req, function(err, user, message){
					if(err){
						err.user=user;
						return done(err); // возвращаем только err потому что всё равно password.js ничего другого обработчику ошибок не передаёт! Гребанный password
					}else{
						return done(null, user, { message: message });
					};
				});
			}
		)
	);

	passport.serializeUser(function(remote_profile, done) {
		// возвращаем то, что потом будет в сессии, лучше просто айдишник
		// видимо здесь нужно проверить пользователя на сущестование в базе, и если его там нет, то добавить
		//console.log('Пришло от соцсети::'.red,  util.inspect(remote_profile, {depth:8}) );
		saveUser(remote_profile, function(profile){
			done(null, profile.iduser);
		}, done);
	});

	passport.deserializeUser(function(iduser, done) {
		// возвращаем то, что потом будет в req.user
		//console.log('deserializeUser'.green, iduser);
		restoreUser(iduser, function(err, profile){
			if(err){
				//console.log('deserializeUser: error'.green);
				done(err);
			}else{
				//console.log('deserializeUser: ok'.green, profile);
				done(null, profile);
			};
		})
	});
	return passport;
};


function saveUser(remote_profile, callback, callback_err){
	user_data_ro(
		remote_profile,
		function(result){
			callback(result);
		},
		function(err){
			console.log(err);
			if(err.message.match(/Not found/)){
				console.log('NOTFOUND', remote_profile);
				user_add(remote_profile, callback, callback_err);
			}else{
				callback_err(err)
			};
		}
	);
};

function restoreUser(iduser, callback){
	user_data_ro(
		{iduser: iduser},
		function(result){
			callback(null, result, "Ok");
		},
		function(err){
			callback(err);
		}
	);
};

function getLocalUserByNamePass(username, password, req, callback){
	if(req && req.session && req.session.something){
		user_data_ro(
			{username:username, password:password, something:req.session.something},
			function(result){
				if(result.enabled){
					callback(null, result, "Ok");
				}else{
					var err = new Error('Disabled user');
					err.number = 117
					callback(err);
				};
			},
			function(err){
				callback(err);
			}
		);
	}else{
		callback(new Error('No data'));
	};
};
