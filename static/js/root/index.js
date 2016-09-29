angular.module('root', ['api', 'geom']);

angular.module('root').controller('root', function($scope, api, geom){
	$scope.mode=true;
	$scope.data={};

	$scope.turnNext=function(){
		if(!$scope.data.rows) $scope.loadSteads();
		$scope.mode=!$scope.mode;
	};

	$scope.turnPrev=function(){
		$scope.mode=!$scope.mode;
	};

	$scope.loadSteads=function(){
		return api.call('/api/stead/list_ro', {}, true, true)
		.then(function(result){
			$scope.data.rows=result.rows;
			$scope.data.rows.forEach(function(row){
				row.center = geom.calcCenter(row.points, row.start);
				var a=row.start.split(',');
				row.strt={};
				row.strt.x = 1*a[0];
				row.strt.y = 1*a[1];
			});
		});
	};

	$scope.hover=function(st){
		$scope.data.curr=st;
	}

});


