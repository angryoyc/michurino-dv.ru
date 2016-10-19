#!/usr/local/bin/node
/**
* Инкримирование счетчика просмотра для новости.
*
*/

var env=require('../../modules/env');
var db = require('db');
var async = require('async');


// GO
exports.go = function(req, res){
	env.std_go(req, res, exports.do, (1+8));
};

// DO
exports.do=function(arg, callback, callback_err, idata){
	var data = idata || {};
	data.idgallery = arg.idgallery?parseInt(arg.idgallery):null;
	if(data.idgallery && (arg.title || arg.note || typeof(arg.enabled)!=='undefined')){
		db.sql('select * from m.gallery where gallery.idgallery=$1;', [data.idgallery], function(result){
			if(result.rows.length>0){
				async.series(
					[
						function(cb){
							db.sql('update m.gallery set title=$2 where gallery.idgallery=$1 returning title;', [data.idgallery, arg.title], function(result){
								if(result.rows.length>0){
									data.title = result.rows[0].title;
									cb();
								}else{
									cb(env.error(115));
								}
							}, cb);
						},
						function(cb){
							db.sql('update m.gallery set note=$2 where gallery.idgallery=$1 returning note;', [data.idgallery, arg.note], function(result){
								if(result.rows.length>0){
									data.note = result.rows[0].note;
									cb();
								}else{
									cb(env.error(115));
								}
							}, cb);
							
						},
						function(cb){
							db.sql('update m.gallery set enabled=$2 where gallery.idgallery=$1 returning enabled;', [data.idgallery, (arg.enabled?true:false)], function(result){
								if(result.rows.length>0){
									data.enabled = result.rows[0].enabled;
									cb();
								}else{
									cb(env.error(115));
								}
							}, cb);
							
						}
					],
					function(err){
						if(err){callback_err(err)}else{
							data.saved=true;
							callback(data);
						};
					}
				);
			}else{
				callback_err(env.error(104, [data.idgallery]));
			};
		}, callback_err);
	}else{
		callback_err(env.error(109, [data.idgallery]));
	};
};
