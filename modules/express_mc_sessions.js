module.exports=function(conf, express){
	// sessions: 
	//var ms = require('connect-memcached')(express);
	var ms = require('connect-memcached')(require('express-session'));
	var memcacheshosts=[];
	for(var i=0; i<conf.memcache.length; i++ ){
		memcacheshosts.push(
			(conf.memcache[i].host || 'memcache' ) + ':' + (conf.memcache[i].port || '11211')
		);
	};

	return express.session(
		{
			secret: 'jlyfrj',
			store: new ms(
				{
					hosts: memcacheshosts
				}
			),
			cookie:{
				path: '/',
				httpOnly: true,
				maxAge: null
			}
		}
	)
}
