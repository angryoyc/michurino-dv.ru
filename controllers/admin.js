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
	stead: function(req, res){
		res.render('admin/stead/index', {ng_app: 'admin', req:req});
	},
	gallery: {
		index: function(req, res){
			res.render('admin/gallery/index', {ng_app: 'admin', req:req});
		},
		edit: function(req, res){
			res.render('admin/gallery/edit', {ng_app: 'admin', req:req});
		}
	}

};
