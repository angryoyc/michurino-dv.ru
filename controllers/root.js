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

function getLastGallery(callback, callback_err){
	var gallery={};
	api_gallery_list_ro({}, function(result){
		gallery.list = result.rows;
		gallery.last=gallery.list.reduce(function(prev, row){
			if(row.enabled){
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
				res.render('root/main', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, params:params, selected: 0});
			});
		},
		about: function(req, res){
			getParams(function(params){
				res.render('root/about', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, params:params, selected: 1});
			});
		},
		gallery: function(req, res){
			getParams(function(params){
				getLastGallery(function(gallery){
					res.render('root/gallery', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, params:params, gallery:gallery, selected: 2});
				});
			});
		},
		contacts: function(req, res){
			getParams(function(params){
				res.render('root/contacts', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, params:params, selected: 3});
			});
		},
		ekopark: function(req, res){
			getParams(function(params){
				res.render('root/main', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, params:params, selected: 4});
			});
		},
		news: function(req, res){
			getParams(function(params){
				res.render('root/news', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, params:params, selected: 2});
			});
		}
	};




