angular.module('root', ['api']);

angular.module('root').controller('root', function($scope){
	$scope.mode=false;
	$scope.turnNext=function(){
		//var slider = $('.mainslider').unslider('next');
		$scope.mode=!$scope.mode;
	};

	$scope.turnPrev=function(){
		//var slider = $('.mainslider').unslider('prev');
		$scope.mode=!$scope.mode;
	};

});


