angular.module('root', ['api']);

angular.module('root').controller('root', function($scope){
	$scope.mode=true;

	$scope.turnNext=function(){
		$scope.mode=!$scope.mode;
	};

	$scope.turnPrev=function(){
		$scope.mode=!$scope.mode;
	};

});


