angular.module('admin').controller('claims', function($scope, api, geom){
	$scope.data = {filter:{idstead:0, alias: ''}, rows:[]};
	$scope.moment=moment;

	$scope.loadclaims=function(){
		var filter=$scope.data.filter;
		var data = {idstead: filter.idstead};

		if($scope.data.filter.alias) data.alias=$scope.data.filter.alias;
		if($scope.data.filter.fio) data.fio=$scope.data.filter.fio;
		if($scope.data.filter.phone) data.phone=$scope.data.filter.phone;

		api.call('/api/claims/list_ro', data, true, true)
		.then(function(result){
			$scope.data.rows=result.rows;
		})
	};

	$scope.loadsteads=function(){
		return api.call('/api/stead/list_ro', {}, true, true)
		.then(function(result){
			$scope.data.steads = result.rows;
		});
	};

	$scope.$watch('data.filter.idstead', function(oldval, newval){$scope.loadclaims();});
	$scope.$watch('data.filter.alias',   function(oldval, newval){$scope.loadclaims();});
	$scope.$watch('data.filter.fio',     function(oldval, newval){$scope.loadclaims();});
	$scope.$watch('data.filter.phone',   function(oldval, newval){$scope.loadclaims();});

	//-------- Показываем панель "Редактировать" -----------
	$scope.showPanelEdit=function(index, event){
		event.preventDefault();
		var claims = $scope.data.rows[index];
		$scope.data.curr=claims;
		$scope.data.curr_index=index;
		$scope.data.curr.center = geom.calcCenter($scope.data.curr.points);
		$('#modal_edit').modal('show');
	};

	$scope.loadsteads();

});
