var conf=require('../config.json');
module.exports={
	index: function(req, res){
		res.render('root/index', {ng_app:'root', req:req, conf:conf});
	},
	main: function(req, res){
		res.render('root/main', {ng_app:'root', req:req, conf:conf, fs: require('fs')});
	},
	schem: function(req, res){
		res.render('root/schem', {ng_app:'root', req:req, conf:conf, fs: require('fs')});
	}
}



