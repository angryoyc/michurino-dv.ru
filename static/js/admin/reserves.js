angular.module('admin').controller('reserves', function($scope, api, geom, $timeout){
	$scope.data = {filter:{idstead:null, alias: ''}, rows:[]};
	$scope.moment=moment;
	$timeout(function(){$scope.data.filter.idstead=0},1000)

	$scope.loadreserves=function(){
		var filter=$scope.data.filter;
		var data = {idstead: filter.idstead};

		if($scope.data.filter.fio) data.fio=$scope.data.filter.fio;
		if($scope.data.filter.phone) data.phone=$scope.data.filter.phone;

		api.call('/api/reserves/list_ro', data, true, true)
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

	$scope.$watch('data.filter.idstead', function(oldval, newval){$scope.loadreserves();});
	$scope.$watch('data.filter.fio',     function(oldval, newval){$scope.loadreserves();});
	$scope.$watch('data.filter.phone',   function(oldval, newval){$scope.loadreserves();});

	//-------- Показываем панель "Редактировать" -----------
	$scope.showPanelEdit=function(index, event){
		event.preventDefault();
		if(index>=0){
			var reserves = $scope.data.rows[index];
			$scope.data.curr = reserves;
			$scope.data.curr_index = index;
			$scope.saveBak();
			$('#modal_edit').modal('show');
		}else{
			$scope.data.curr = {idstead: $scope.data.filter.idstead || 0, fio:'', note:'', phone:'', from_dt: moment().format('YYYY-MM-DD HH:mm'), to_dt: moment().add('day',3).format('YYYY-MM-DD HH:mm'), contract_nom:'', contract_date: moment().format('YYYY-MM-DD')}
			$scope.data.curr_index = -1;
			$scope.saveBak();
			$('#modal_edit').modal('show');
		};
	};


	//-------------------------- EDIT ----------------------------
	$scope.saveBak=function(){
		if($scope.data.curr){
			var bak = $scope.data.curr.bak = {};
			bak.pp = $scope.data.curr.pp;
			bak.idstead = $scope.data.curr.idstead;
			bak.fio = $scope.data.curr.fio;
			bak.phone = $scope.data.curr.phone;
			bak.note = $scope.data.curr.note;
			bak.from_dt = $scope.data.curr.from_dt;
			bak.to_dt = $scope.data.curr.to_dt;
			bak.contract_nom = $scope.data.curr.contract_nom;
			bak.contract_date = $scope.data.curr.contract_date;
		};
	};

	$scope.isNeedSave = function(curr){
		if($scope.data.curr){
			var bak = $scope.data.curr.bak;
			var curr = $scope.data.curr;
			return (bak.idstead != curr.idstead) || (bak.to_dt != curr.to_dt) || (bak.from_dt != curr.from_dt) || (bak.fio != curr.fio) || (bak.phone != curr.phone) || (bak.note != curr.note) || (bak.contract_nom != curr.contract_nom) || (bak.contract_date != curr.contract_date);
		}else{
			return false;
		};
	};

	$scope.closereserve=function(){
		delete $scope.data.curr;
		$('#modal_edit').modal('hide');
	}


	$scope.savereserve=function(){
		$scope.saveBak();
		var curr = $scope.data.curr;
		return api.call('/api/reserves/save', {idstead: curr.idstead, fio: curr.fio, phone: curr.phone, note: curr.note, idreserve: curr.idreserve, from_dt: curr.from_dt, to_dt: curr.to_dt, contract_nom: curr.contract_nom, contract_date: curr.contract_date, price: curr.price}, true, true)
		.then(function(result){
			$scope.closereserve();
		});
	};

	//-------------------------------------------------------

	$scope.loadsteads();

});
