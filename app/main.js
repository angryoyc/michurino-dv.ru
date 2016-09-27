var requiretree = require('require-tree');
var path = require('path');
var conf = require("../config.json");

var methodOverride = require('method-override')
var controllers = requiretree('../controllers');		// важен порядок

var express = require('express');
var app = express();


var colors = require('colors');
colors.setTheme(conf.color_theme);
//

app.set('port', process.env.PORT || conf.server.port);
app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');


app.use(express.favicon(path.join(__dirname,  '../static/favicon.ico')));

if(process.env.NODE_ENV !== 'test') { app.use(express.logger('dev')); }

app.use(express.cookieParser());

app.use(express.json());
app.use(express.urlencoded());

app.use(methodOverride('X-HTTP-Method-Override'));

passport=require('../modules/passport.js')();
app.use(passport.initialize());
app.use(passport.session());



app.use('/static', express.static(path.join(__dirname, '../static')));

app.use(app.router);

process.on('SIGTERM', function(){console.log('SIGTERM');process.exit(1);});
process.on('SIGHUP', function(){console.log('SIGHUP');});
if ('development' == app.get('env')){app.use(express.errorHandler());};



var api = require('../modules/api');

	app.all('/api/:scheme/:method', api.go);

/* ----------------------- routes ------------------------------ */

	// -----------------  LOCAL  ---------------------
	app.post('/login', function(req, res, next) {
		passport.authenticate(
			'local',
			function(err, user, info) {
				if(err){
//					return res.redirect('/login?err='+err.number);
					return res.redirect('/login#/error/'+err.number);
				}else{
					if(user){
						return req.logIn(
							user,
							function(err) {
								//req.session.message='OK';
								//console.log(req.session);
								return err? next(err) : res.redirect(req.session.callbackto || '/');
							}
						)
					}else{
						req.session.message=info.message;
						return res.redirect('/login');
					}
				}
			}
		)(req, res, next);
	});

	// -----------------  FACEBOOK  ---------------------
	app.get(
		'/auth/fb',
		passport.authenticate('facebook'),
		function(req, res){
			// The request will be redirected to Facebook for authentication, so this
			// function will not be called.
		}
	);
	app.get(
		'/auth/fb/callback',
		passport.authenticate('facebook', { failureRedirect: '/login' }),
		function(req, res) {
			res.redirect(req.session.callbackto || '/');
		}
	);

	// -----------------  VKONTAKTE  ---------------------
	app.get(
		'/auth/vk',
		passport.authenticate('vkontakte'),
		function(req, res){
			// The request will be redirected to Facebook for authentication, so this
			// function will not be called.
		}
	);
	app.get(
		'/auth/vk/callback',
		passport.authenticate('vkontakte', { failureRedirect: '/login' }),
		function(req, res) {
			res.redirect(req.session.callbackto || '/');
		}
	);

	// -----------------  ODNOKLASSNIKI  ---------------------
	app.get(
		'/auth/ok/callback',
		passport.authenticate('odnoklassniki', { failureRedirect: '/login' }),
		function(req, res) {
			res.redirect(req.session.callbackto || '/');
		}
	);
	app.get(
		'/auth/ok',
		passport.authenticate('odnoklassniki'),
		function(req, res){
			// The request will be redirected to Facebook for authentication, so this
			// function will not be called.
		}
	);

	// -----------------  All  ---------------------

	app.get(
		'/logout',
		function(req, res) {
			req.logOut();
			res.redirect('/');
		}
	);

	app.all('/login', controllers.login.main);
	app.all('/login/form', controllers.login.form);
	app.all('/login/auth', controllers.login.auth);
	app.all('/login/registration', controllers.login.registration);
	app.all('/login/restore', controllers.login.restore);
	app.all('/login/error', controllers.login.error);

	app.all('/about', controllers.about);

	app.all('/admin', ensureAuthenticatedAdmin, controllers.admin.index);
	app.all('/admin/info', ensureAuthenticatedAdmin, controllers.admin.info);
	app.all('/admin/users', ensureAuthenticatedAdmin, controllers.admin.users);
	app.all('/admin/news', ensureAuthenticatedAdmin, controllers.admin.news);

//	app.all('/video/src/:id', controllers.video.src);
//	app.all('/video/pvw/:id', controllers.video.pvw);
//	app.all('/video/tnl/:id', controllers.video.tnl);


	app.get('/', controllers.root);

//	app.all('/', controllers.news.last);


/* --------------------- end routes ------------------------------ */

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
};

function ensureAuthenticatedAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user && ((req.user.rights || 0) & 1)==1) { return next(); }
  res.redirect('/login#/error/' + 113);
};


module.exports = app;