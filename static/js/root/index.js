angular.module('root', ['api', 'geom']);

angular.module('root').controller('root', function($scope, api, geom){
	$scope.mode=true;
	$scope.data={cost:550};

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
		if(st){
			if(st.status!='busy'){
				if($scope.data.curr){
					var idstead = $scope.data.curr.idstead;
					$scope.data.curr.parent.selected = false;
					delete $scope.data.curr;
					if(st.idstead!=idstead){
						$scope.data.curr = {};
						angular.extend($scope.data.curr, st);
						$scope.data.curr.parent = st;
						$scope.data.curr.parent.selected = true;
					};
				}else{
					$scope.data.curr={};
					angular.extend($scope.data.curr,st);
					$scope.data.curr.parent=st;
					$scope.data.curr.parent.selected=true;
				};
			}
		};
	}

});


