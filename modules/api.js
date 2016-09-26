var param=require('../modules/param');
var requiretree=require('require-tree');
var api=requiretree('../api');
var cf=require('cf');

module.exports = {
	go: function (req, res){
		var schemename=param(req, 'scheme', 'defa', false);
		if(cf.isObject(api[schemename])){
			var method=param(req, 'method', 'defa', false);
			if(cf.isObject(api[schemename][method])){
				api[schemename][method].go(req, res);
			}else{
				res.statusCode=404;
				res.end();
			};
		}else{
			res.statusCode=404;
			res.end();
		};
	}
};
