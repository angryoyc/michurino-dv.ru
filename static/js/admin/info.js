angular.module('admin').controller('info', function($scope, api){
	$scope.data={};
	api.call('/api/info/data_ro', {}, true, true)
	.then(function(result){
		$scope.data.info=result;
	});
});
