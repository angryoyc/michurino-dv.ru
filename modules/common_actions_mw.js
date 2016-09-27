var cf  = require('cf');
var url  = require('url');

module.exports=function(req, res, next){
	// для некоторых страниц (для входа на которые нужна авторизация, запоминаем их адрес в req.session.callbackto, чтобы знать, куда делать редирект, после успешной авторизации...
//	var needremember=['/auth/ok', '/auth/ok/callback',  '/auth/vk', '/auth/vk/callback', '/auth/fb', '/auth/fb/callback', '/static', '/login'];
//	var isexclude=false;
	if(cf.isObject(req.session)){

		req.session.callbackto='/admin';
/*
		for(i=0; i<needremember.length; i++){
			var r=new RegExp('^'+needremember[i]);
			if(req.url.match(r)){
				isexclude=true;
				break;
			};
		};

		if(!isexclude){
			var path=req.url.replace(/\?.*$/,'');
			req.session.callbackto=path;
		};
*/
	};
	next();
};

