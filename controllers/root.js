var conf=require('../config.json');
var api_params_list_ro = require('../api/params/list_ro').do;
var api_gallery_list_ro = require('../api/gallery/list_ro').do;
var api_gallery_info_ro = require('../api/gallery/info_ro').do;

var menu=[
	{caption: 'Главная', href:'/', isbig: false},
	{caption: 'О посёлке', href:'/about', isbig: false},
//	{caption: 'Новости', href:'/news', isbig: false},
	{caption: 'Галерея', href:'/gallery', isbig: false},
	{caption: 'Контакты', href:'/contacts', isbig: false},
	{caption: 'Экопарк Мичурино', href:'/ekopark', isbig: true}
]

function getParams(callback, callback_err){
	api_params_list_ro({}, function(result){
		var params={};
		result.rows.forEach(function(p){
			params[p.param]=p.val;
		})
		callback(params);
	}, function(){});
}


function getLastGallery(idgallery, callback, callback_err){
	var gallery={};
	api_gallery_list_ro({}, function(result){
		gallery.list = result.rows;
		gallery.last=gallery.list.reduce(function(prev, row){
			if(row.enabled && ((!idgallery) || (idgallery==row.idgallery))){
				if(!prev){
					return row;
				}else{
					return prev;
				};
			}else{
				return prev;
			};
		}, null);


		if(gallery.last && gallery.last.idgallery>0){
			gallery.list = gallery.list.filter(function(g){
				return g.enabled && (1*gallery.last.idgallery!=1*g.idgallery)
			});
			api_gallery_info_ro({idgallery:gallery.last.idgallery}, function(result){
				gallery.last.items = result.files;
				gallery.last.note = result.note;
				callback(gallery);
			}, function(){});
		}else{
			gallery.last={items:[]};
			callback(gallery);
		}
	}, function(){});
};


	module.exports={
		index: function(req, res){
			getParams(function(params){
				res.render('root/main', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, params:params, selected: 0, title:'Мичурино. Участки под застройку.'});
			});
		},
		about: function(req, res){
			getParams(function(params){
				res.render('root/about', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, params:params, selected: 1, title:'Мичурино. Участки под застройку. О проекте.'});
			});
		},
		gallery: function(req, res){
			var idgallery = req.params['idgallery'] || 0;
			getParams(function(params){
				getLastGallery(idgallery, function(gallery){
					res.render('root/gallery', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, params:params, gallery:gallery, selected: 2, title:'Мичурино. Участки под застройку. Галерея.'});
				});
			});
		},
		contacts: function(req, res){
			getParams(function(params){
				res.render('root/contacts', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, params:params, selected: 3, title:'Мичурино. Участки под застройку. Контакты.'});
			});
		},
		ekopark: function(req, res){
			getParams(function(params){
				res.render('root/main', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, params:params, selected: 4, title:'Мичурино. Участки под застройку. Экопарк.'});
			});
		},
		news: function(req, res){
			getParams(function(params){
				res.render('root/news', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, params:params, selected: 2, title:'Мичурино. Участки под застройку. Новости.'});
			});
		}
	};




