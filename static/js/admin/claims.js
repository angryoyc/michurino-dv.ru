angular.module('admin').controller('claims', function($scope, api, geom, $timeout){
	$scope.data = {filter:{idstead:null, alias: ''}, rows:[]};
	$scope.moment=moment;
	$timeout(function(){$scope.data.filter.idstead=0},1000)

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
		$scope.saveBak();
		$('#modal_edit').modal('show');
	};


	//-------------------------- EDIT ----------------------------
	$scope.saveBak=function(){
		if($scope.data.curr){
			var bak = $scope.data.curr.bak = {};
			bak.pp = $scope.data.curr.pp;
			bak.dt = $scope.data.curr.dt;
			bak.alias = $scope.data.curr.alias;
			bak.fio = $scope.data.curr.fio;
			bak.phone = $scope.data.curr.phone;
			bak.note = $scope.data.curr.note;
		};
	};

	$scope.isNeedSave = function(curr){
		if($scope.data.curr){
			var bak = $scope.data.curr.bak;
			var curr = $scope.data.curr;
			return (bak.pp != curr.pp) || (bak.dt != curr.dt) || (bak.alias != curr.alias) || (bak.fio != curr.fio) || (bak.phone != curr.phone) || (bak.note != curr.note);
		}else{
			return false;
		};
	};

	$scope.closeClaim=function(){
		delete $scope.data.curr;
		$('#modal_edit').modal('hide');
	}


	$scope.saveClaim=function(){
		$scope.saveBak();
		var curr = $scope.data.curr;
		return api.call('/api/claims/save', {alias: curr.alias, fio: curr.fio, phone: curr.phone, note: curr.note, idclaim: curr.idclaim}, true, true)
		.then(function(result){
			$scope.closeClaim();
		});
	};

	//-------------------------------------------------------

	$scope.loadsteads();

});
