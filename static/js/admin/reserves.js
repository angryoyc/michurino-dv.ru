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
			$scope.data.curr = {idstead: $scope.data.filter.idstead || 0, type:'reserved', fio:'', note:'', phone:'', from_dt: moment().format('YYYY-MM-DD HH:mm'), to_dt: moment().add('day',3).format('YYYY-MM-DD HH:mm'), contract_nom:'', contract_date: moment().format('YYYY-MM-DD')}
			$scope.data.curr_index = -1;
			$scope.saveBak();
			$('#modal_edit').modal('show');
		};
	};

	$scope.showdate=function(dt){
		return (dt==null)?' --- ':moment(dt).format('YYYY-MM-DD HH:mm');
	};

	$scope.remove=function(index){
		swal(
			{
				title: "Уверены?",
				text: "Удаление бронирования/продажи" ,
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Удалить",
				cancelButtonText: "Отменить",
				closeOnConfirm: true 
			},
			function(){
				var rs = $scope.data.rows[index];
				return api.call('/api/reserves/remove', {idreserve: rs.idreserve}, true, true)
				.then(function(result){
					if(result.deleted){
						$scope.data.rows.splice(index,1);
					};
				});
			}
		);
	};

	//-------------------------- EDIT ----------------------------
	$scope.saveBak=function(){
		if($scope.data.curr){
			var bak = $scope.data.curr.bak = {};
			bak.pp = $scope.data.curr.pp;
			bak.idstead = $scope.data.curr.idstead;
			bak.type = $scope.data.curr.type;
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
			return (bak.idstead != curr.idstead) || (bak.to_dt != curr.to_dt) || (bak.from_dt != curr.from_dt) || (bak.type != curr.type) || (bak.fio != curr.fio) || (bak.phone != curr.phone) || (bak.note != curr.note) || (bak.contract_nom != curr.contract_nom) || (bak.contract_date != curr.contract_date);
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
		return api.call('/api/reserves/save', {idreserve: curr.idreserve, idstead: curr.idstead, type: curr.type, fio: curr.fio, phone: curr.phone, note: curr.note, from_dt: curr.from_dt, to_dt:(curr.type=='sold')?null:curr.to_dt, contract_nom: curr.contract_nom, contract_date: curr.contract_date, price: curr.price})
		.then(
			function(result){
				if(curr.idreserve>0){
					//update
					curr.pp = result.pp;
					curr.type = result.type;
					curr.fio = result.fio;
					curr.phone = result.phone;
					curr.note = result.note;
					curr.from_dt = result.from_dt;
					curr.to_dt = result.to_dt;
					curr.contract_nom = result.contract_nom;
					curr.contract_date = result.contract_date;
					curr.price = result.price;
				}else{
					//insert
					$scope.data.rows.unshift(result);
				}
				$scope.closereserve();
			},
			function(err){
				if(err.error==110){
					swal('Внимание!', 'Заданный период пересекается с другим по этому участку', 'error');
				}else{
					swal('Внимание!', err.message, 'error');
				}
			}
		);
	};

	//-------------------------------------------------------

	$scope.loadsteads();

});
