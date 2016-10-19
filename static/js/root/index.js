angular.module('root', ['ngRoute', 'api', 'geom']);

angular.module('root').config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/main',   {templateUrl: '/root/main', controller: 'main'});
	$routeProvider.when('/schem',   {templateUrl: '/root/schem', controller: 'schem'});
	$routeProvider.otherwise({redirectTo: '/main'});
}]);

angular.module('root').controller('index', function($scope, $rootScope){
});

angular.module('root').controller('main', function($scope, $rootScope, $timeout){
	$timeout(function(){
		$scope.mode=true;
	}, 200);
	$scope.nextSlide=function(){
		$('div#carousel-example-generic.carousel').carousel('next');
	}
	$scope.prevSlide=function(){
		$('div#carousel-example-generic.carousel').carousel('prev');
	}
});


angular.module('root').controller('schem', function($scope, api, geom, $timeout){

	$scope.data={cost:550};

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
				$scope.mode=true;
			});
		});
	};

	$scope.loadSteads();

	$scope.hover=function(st){
		if(st){
			if(st.status!='busy'){
				if($scope.data.curr){
					var idstead = $scope.data.curr.idstead;
					if(st.idstead!=idstead){
						setSelected(false);
						$scope.data.curr = {};
						angular.extend($scope.data.curr, st);
						$scope.data.curr.parent = st;
						setSelected(true);
					}else{
						setSelected(false);
						delete $scope.data.curr;
					};
				}else{
					$scope.data.curr={};
					angular.extend($scope.data.curr,st);
					$scope.data.curr.parent=st;
					setSelected(true);
				};
			}
		};
	};

	var setSelected=function(sel){
		$scope.data.curr.parent.selected=sel;
		$scope.setSidebarPosition(sel);
	};

	$scope.stakeThis=function(st){
		if($scope.data.curr){
			if(!$scope.data.curr.form){
				$scope.data.curr.form = {};
				$scope.data.curr.form.phone='';
				$timeout(function(){$('input#phone').focus();}, 100);
			}else{
				delete $scope.data.curr.form;
			}
		}
	};

	$scope.sendReserveRequest=function(st){
		if($scope.data.curr.form.phone){
			$scope.data.curr.form.sending=true;
			api.call('/api/send/reserve_request', {phone: $scope.data.curr.form.phone, pp:st.pp}, true, true)
			.then(function(result){
				if(result.sent){
					$scope.data.curr.form.sending=false;
					delete $scope.data.curr.form;
					swal("Отлично!", "Ваш запрос отправлен", "success");
				}else{
					$scope.data.curr.form.sending=false;
					swal("Неудача", result.message, "error");
				};
				$timeout($scope.setSidebarPosition, 300);
			});
		};
	};

	$scope.setSidebarPosition = function(mode) {
		var top;
		if(mode){
			top = ($(window.top).height() - $("#sidebar").height())/2  + $(window.top).scrollTop();
			// + $("#mainsvg").position().top;
		}else{
			top = '-100%';
		}
		$("#sidebar").css('top', top);
	};

});


