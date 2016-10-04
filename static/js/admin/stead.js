angular.module('admin').controller('stead', function($scope, api, geom){
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

		$scope.data.curr.center = geom.calcCenter($scope.data.curr.points);

		$('#modal_edit').modal('show');
	};

	$scope.saveStead=function(){
		api.call('/api/stead/save', $scope.data.curr, true, true)
		.then(function(result){
			angular.extend($scope.data.curr, result)
			$('#modal_edit').modal('hide');
		});
	};

	$scope.calcStart=function(points){
		var ex = geom.calcExtremums(points);
		return [(-1)*ex.min.x + 5, (-1)*ex.min.y + 5].join(',');
	}

	$scope.calcViewbox=function(points){
		var ex = geom.calcExtremums(points);
		return [0, 0, (ex.max.x-ex.min.x) + 10, (ex.max.y - ex.min.y) + 10].join(' ');
	}
});
