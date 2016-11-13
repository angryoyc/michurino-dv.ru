var supertest = require('supertest')
var cf = require('cf');
/*
conf={
	"cron":[
		{
			"interval": 300000,
			"method": "recalc_all_statuses"
		}
	]
}
*/

module.exports=function(app, conf){
	if(conf && cf.isArray(conf.cron)){
		conf.cron.forEach(function(proc){
			var interval = proc.interval || 5000;
			if(typeof(interval)=='number'){
				interval=parseInt(interval);
			};
			if (interval<1000) interval = 1000;
			setCronInterval(app, interval, proc.method);
		});
	};
};

function setCronInterval(app, interval, method){
	setInterval(function(){
		supertest(app)
		.post('/api/cron/'+ method)
		.send({interval: parseInt(interval/1000)})
		.end(function(err, res){});
	}, interval);
};
