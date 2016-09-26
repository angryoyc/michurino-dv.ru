module.exports = {
	index: function(req, res){
		res.render('admin/index', {ng_app: 'admin', req:req});
	},
	info: function(req, res){
		res.render('admin/info',  {ng_app: 'admin', req:req});
	},
	users: function(req, res){
		res.render('admin/users/index', {ng_app: 'admin', req:req});
	},
	news: function(req, res){
		res.render('admin/news/index', {ng_app: 'admin', req:req});
	}
};
