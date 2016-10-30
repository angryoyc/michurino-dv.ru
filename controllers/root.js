var conf=require('../config.json');

var menu=[
	{caption: 'Главная', href:'/', isbig: false},
	{caption: 'О посёлке', href:'/about', isbig: false},
	{caption: 'Новости', href:'/news', isbig: false},
	{caption: 'Галерея', href:'/gallery', isbig: false},
	{caption: 'Контакты', href:'/contacts', isbig: false},
	{caption: 'Экопарк Мичурино', href:'/ekopark', isbig: true}
]


module.exports={
	index: function(req, res){
		res.render('root/main', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, selected: 0});
	},
	about: function(req, res){
		res.render('root/about', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, selected: 1});
	},
	news: function(req, res){
		res.render('root/news', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, selected: 2});
	},
	gallery: function(req, res){
		res.render('root/gallery', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, selected: 3});
	},
	contacts: function(req, res){
		res.render('root/contacts', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, selected: 4});
	},
	ekopark: function(req, res){
		res.render('root/main', {ng_app:'root', req:req, conf:conf, fs: require('fs'), menu: menu, selected: 5});
	}
	/*
	schem: function(req, res){
		res.render('root/schem', {ng_app:'root', req:req, conf:conf, fs: require('fs')});
	}
	*/
}



