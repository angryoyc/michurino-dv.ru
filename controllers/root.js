var conf=require('../config.json');
module.exports=function(req, res){
	res.render('root/index', {ng_app:'root', req:req, conf:conf});
};

