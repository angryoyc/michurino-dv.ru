angular.module('admin').controller('params', function($scope, api, geom){
	$scope.data = {};
	$scope.loadData=function(){
		return api.call('/api/params/list_ro', {}, true, true)
		.then(function(result){
			$scope.data.rows=result.rows;
			$scope.data.rows.forEach(function(p){
				p.bak = p.val;
			})
		});
	};
	$scope.loadData();

	$scope.saveParam=function(p){
		return api.call('/api/params/save', {idparam: p.idparam, val: p.val}, true, true)
		.then(function(result){
			p.val = p.bak = result.val;
		});
	}

});
