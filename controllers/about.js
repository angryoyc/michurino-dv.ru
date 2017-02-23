var conf=require('../config.json');

module.exports=function(req, res){
	res.render('about/index', {ng_app:'root', req:req, conf:conf});
};

