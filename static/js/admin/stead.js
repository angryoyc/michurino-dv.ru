angular.module('admin').controller('stead', function($scope, api){
	$scope.data = {};
	$scope.data.cost = 550;

	$scope.loadSteads=function(){
		api.call('/api/stead/list_ro', {}, true, true)
		.then(function(result){
			$scope.data.rows=result.rows;
		});
	};

	$scope.loadSteads();

	//-------- Показываем панель "Редактировать" -----------
	$scope.showPanelEdit=function(index, event){
		event.preventDefault();
		var stead = $scope.data.rows[index];
		$scope.data.curr=stead;
		$scope.data.curr_index=index;
		$('#modal_edit').modal('show');
	};

	$scope.saveStead=function(){
		api.call('/api/stead/save', $scope.data.curr, true, true)
		.then(function(result){
			angular.extend($scope.data.curr, result)
			$('#modal_edit').modal('hide');
		});
	};

});
