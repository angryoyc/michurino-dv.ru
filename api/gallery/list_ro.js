#!/usr/local/bin/node

var env=require('../../modules/env');
var db = require('db');
var cf = require('cf');
var async = require('async');

//var decorate_ro=require('../gallery/decorate_ro').do;


// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do);
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};

	data.offset = arg.offset?parseInt(arg.offset):0;
	data.limit = arg.limit?parseInt(arg.limit):30;
	data.term = arg.term || '';

	var values = [ data.offset, data.limit ];
	var where = [];

	if(data.term){
		values.push(data.term);
		where.push('gallery.title ilike \'%\' || $' + values.length + ' || \'%\'');
	};

	var sql = 'select count(1) OVER() as total, idgallery, title, dt, enabled from m.gallery';

	db.sql(sql + (where.length>0?' where ' + where.join(' and '):'') + ' order by gallery.dt desc, gallery.idgallery desc offset $1 limit $2;', values, function(result){
		data.total = (result.rows.length>0)?result.rows[0].total:0;
		data.rows = result.rows;
		addPager(data, function(){
			callback(data);
		}, callback_err, data);
	}, callback_err);

};

function addPager(arg, callback, callback_err, idata){
	var pageblocksize = 5;
	var data = idata || {};

	data.pager = {
		lastpage : Math.ceil(arg.total / arg.limit)-1,
		frompage : Math.floor((Math.ceil((arg.offset) / arg.limit)/pageblocksize)) * pageblocksize,
		list:[]
	};

	for(var i=data.pager.frompage; i<Math.min(data.pager.lastpage, data.pager.frompage+pageblocksize); i++){
		data.pager.list.push({offset: i*arg.limit, num: i, caption: i+1});
	};

	if(data.pager.list.length>0){
		if(data.pager.list[0].num>2){
			var prevblockpage=(data.pager.list[0].num - pageblocksize);
			prevblockpage = prevblockpage>0?prevblockpage:0;
			data.pager.list.unshift({offset: prevblockpage*arg.limit, num: prevblockpage, caption: '<<'});

			data.pager.list.unshift({offset: 0, num: 0, caption:1});
		}else if(data.pager.list[0].num>1){
			data.pager.list.unshift({offset: 0, num: 0, caption:1});
		};
		if((data.pager.lastpage-data.pager.list[data.pager.list.length-1].num)==1){

			data.pager.list.push({offset: data.pager.lastpage * arg.limit, num: data.pager.lastpage, caption: data.pager.lastpage+1});

		}else if((data.pager.lastpage-data.pager.list[data.pager.list.length-1].num)>1){
			
			var nextblockpage = data.pager.list[data.pager.list.length-1].num + 1;
			nextblockpage = (nextblockpage+10)>data.pager.lastpage-10?data.pager.lastpage:nextblockpage;
			data.pager.list.push({offset: nextblockpage * arg.limit, num: nextblockpage, caption: '>>' });

			data.pager.list.push({offset: data.pager.lastpage * arg.limit, num: data.pager.lastpage, caption: data.pager.lastpage+1});
		}
	};
	callback(data);
};
