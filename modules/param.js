module.exports=function(req, paramname, defa, saveinsession){
	var param=req.params[paramname] || req.query[paramname] || req.body[paramname] || defa;
	if(typeof(paramname)=='string'){
		if(saveinsession){
			if(!req.session.data) req.session.data={};
			if(typeof(req.params[paramname])!='undefined' || typeof(req.query[paramname])!='undefined' || typeof(req.body[paramname])!='undefined'){
				req.session.data[paramname]=param;
			};
			return req.session.data[paramname] || param;
		}else{
			return param;
		};
	}else{
		return null;
	};
};
