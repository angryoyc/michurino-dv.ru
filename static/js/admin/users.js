angular.module('admin').controller('users', function($scope, api, $rootScope, $timeout, md5){

	$scope.data={list:[], term:''};

	$scope.loadList=function(){
		api.call('/api/user/list_ro', {term: $scope.data.term}, true, true)
		.then(function(result){
			$scope.data.list=result.rows;
		});
	};

	$scope.$watch('data.term', function(oldval, newval){
		$scope.loadList();
	})

	$scope.rightBit=function(rights, bit){
		return ((rights & bit) == bit)?"Да":"Нет";
	};

	$timeout(function(){
		$('#term').focus();
	}, 200);

	//-------- Показываем панель "Редактировать" -----------
	$scope.showPanelEdit=function(index, event){
		$scope.loadUserData(index)
		.then(function(user){
			$('#modal_edit').modal('show');
		});
		event.preventDefault();
	};

	$scope.loadUserData=function(index){
		var user = $scope.data.list[index];
		return api.call('/api/user/data_ro', { iduser: user.iduser }, true)
		.then(function(result){
			$scope.data.curr=result;
			$scope.data.curr_index=index;
			$scope.data.curr.r=[
				($scope.data.curr.rights & 1) == 1,
				($scope.data.curr.rights & 2) == 2,
				($scope.data.curr.rights & 4) == 4,
				($scope.data.curr.rights & 8) == 8,
				($scope.data.curr.rights & 16) == 16,
				($scope.data.curr.rights & 32) == 32,
				($scope.data.curr.rights & 64) == 64
			];
			$scope.data.curr.photo_url = $scope.data.curr.photo_url || '/static/images/ava/ava5.jpg';
			return $scope.data.curr;
		});
	};

	$scope.saveUserData=function(){
		$scope.data.curr.rights = ($scope.data.curr.r[0]?1:0) + ($scope.data.curr.r[1]?2:0) + ($scope.data.curr.r[2]?4:0) + ($scope.data.curr.r[3]?8:0) + ($scope.data.curr.r[4]?16:0) + ($scope.data.curr.r[5]?32:0)  + ($scope.data.curr.r[6]?64:0);
		var sendsms=$scope.data.curr.sendsms;
		if((($scope.data.curr.pass || $scope.data.curr.pass2) && ($scope.data.curr.pass==$scope.data.curr.pass2)) || !($scope.data.curr.pass || $scope.data.curr.pass2)){
			var pss;
			if($scope.data.curr.pass){
				pss=$scope.data.curr.pass;
				var md5pass = md5.createHash($scope.data.curr.username.toLowerCase()+$scope.data.curr.pass);
				$scope.data.curr.md5pass = md5pass;
				delete $scope.data.curr.pass;
				delete $scope.data.curr.pass2;
				delete $scope.data.curr.sendsms;
			};
			api.call('/api/user/save', $scope.data.curr, true)
			.then(function(result){
				angular.extend($scope.data.curr, result);
				$scope.data.list[$scope.data.curr_index].enabled=$scope.data.curr.enabled;
				$scope.data.list[$scope.data.curr_index].rights=$scope.data.curr.rights;
				$scope.data.curr.isPanelVisible=false;
				//swal('Пользователь сохранён');
			})
			.then(function(result){
				if(sendsms){
					return api.call('/api/user/message', {iduser: $scope.data.curr.iduser, message: 'Ваш пароль изменён на '+ pss}, true)
				}else{
					return 0;
				};
			})
			.then(function(result){
				$('#modal_edit').modal('hide');
				delete $scope.data.curr;
			});
		}else{
			swal('Пароли не совпадают. [' + data.curr.pass + ']!=[' + data.curr.pass2 + '] Оставте пароль пустым, если не хотите его менять');
		};
	};
	
	$scope.removeStart=function(index, event){
		var user = $scope.data.list[index];
		event.preventDefault();
		swal(
			{
				title: "Уверены?",
				text: "Попробую удалить пользователя" ,
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Удалить",
				cancelButtonText: "Отменить",
				closeOnConfirm: true 
			},
			function(){
				return api.call('/api/user/remove', {iduser: user.iduser}, true, true)
				.then(function(result){
					if(result.deleted){
						$scope.data.list.splice(index, 1);
						swal('Удалено...');
					}else{
						swal('Удалить не удалось - есть связанные элементы');
					};
				});
			}
		);
	}

	$scope.newUser=function(){
		swal({
			title: "Добавление нового пользователя",
			text: "Укажите имя нового пользователя:",
			type: "input",
			showCancelButton: true,
			closeOnConfirm: false,
			animation: "slide-from-bottom",
			inputPlaceholder: "новое имя входа" }, 
			function(inputValue){
				if (inputValue === false){ return false };
				if (inputValue === "") { return false }
				api.call('/api/user/add', { login: inputValue, provider:'mc' }, true)
				.then(function(result){
					$scope.data.list.unshift(result);
					swal("Отлично!", "Новый пользователь " + inputValue + " создан! Отредактируйте его, и не забудьте поставить галочку 'включен'"); 
					$scope.showPanelEdit(0, {preventDefault:function(){}});
				});
			}
		);
	}
});
