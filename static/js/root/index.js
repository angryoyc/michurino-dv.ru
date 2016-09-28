angular.module('root', ['api']);

angular.module('root').controller('root', function($scope, api){
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
		});
	};
	
	$scope.hover=function(st){
		$scope.data.curr=st;
	}

});


