angular.module('login', ['ngRoute', 'ui.bootstrap', 'angular-md5', 'account', 'api']);

angular.module('login').config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/form',   {templateUrl: '/login/form', controller: 'login_form'});
	$routeProvider.when('/registration',   {templateUrl: '/login/registration', controller: 'login_registration'});
	$routeProvider.when('/restore',   {templateUrl: '/login/restore', controller: 'login_restore'});
	$routeProvider.when('/error/:number?',  {templateUrl: '/login/error', controller: 'login_error'});
	$routeProvider.otherwise({redirectTo: '/form'});
}]);

angular.module('login').run(['$rootScope', function($rootScope){
	$rootScope.data={formstate: 'input', phone:{value:'', isok: false}, confirmcode:{value:'', isok: false}, email:{value:'', isok: false}, pass1:{value:'', isok: false}, pass2:{value:'', isok: false}};
}]);

// common part
	var initData=function(data, force){
		if(force){
			data.phone.value='';
			data.phone.isok=false;
		};
		data.email.value='';
		data.email.isok=false;
		data.pass1.value='';
		data.pass1.isok=false;
		data.pass2.value='';
		data.pass2.isok=false;
		data.sended=false;
		data.formstate='input';
	};

	var testPass1 = function(newval){
		var self=this;
		self.clearMess();
		if(newval.length<3){
			//self.data.mess = 'слишком коротко'
			self.data.pass1.isok=false;
		}else{
			self.data.pass1.isok=true;
			//self.data.mess = 'зер гуд, комрад!'
		};
	};

	var testPass2=function(newval){
		var self=this;
		self.clearMess();
		if(newval.length<3){
			self.data.pass2.isok=false;
		}else{
			if(self.data.pass1.value==self.data.pass2.value){
				self.data.pass2.isok=true;
			}else{
				self.data.pass2.isok=false;
			};
		};
	};

	var clearMess =function(){
		var self=this;
		self.data.mess1=false;
		self.data.mess='';
	};

	var normalizePhone=function(phone){
		var nv=phone.replace(/[ \t\r\n\(\)-]/g,'');
		if(nv.length>10){
			nv=nv.replace(/^8/,'');
			nv=nv.replace(/^\+7/,'');
		};
		if(nv.length==6){
			nv='4212' + nv;
		};
		if(nv.length==10){
			nv='+7' + nv;
		};
		return nv;
	};

	var getWatchPhoneProc=function($scope){
		return function(newval, oldval){
			$scope.clearMess();
			if(newval!=oldval){
				var nv=normalizePhone(newval);
				if(nv.match(/^\+7\d{10}$/)) {
					$scope.data.phone.isok=true;
				}else{
					$scope.data.phone.isok=false;
				}
			};
		};
	};

//---------
//

angular.module('login').controller('main', function($scope, $rootScope){
	//console.log('login/main');
	$scope.init=function(username, mess){
		if(username) $rootScope.data.phone.value = username;
		if (mess) toastr.error(mess);
	}
});


angular.module('login').controller('login_form', function($scope, $rootScope, md5, password){
	$scope.data = $rootScope.data;
	$scope.data.pass1.value='';
	$scope.data.pass2.value='';
	var something;
	$scope.init = function(some){
		$scope.data.something = something = some;
	};
	password.setPhoneTests($scope);
	$scope.submit = function(){
		if(something && something.length==32){
			var pass = md5.createHash($scope.data.phone.value.toLowerCase()+$scope.data.pass1.value);
			$scope.data.pass1.value=md5.createHash(something+pass);
		}else{
			alert('Какая-то ошибка. Невозможно отправить регистрационные данные.');
		};
	};
});


angular.module('login').controller('login_restore', function($scope, $rootScope, $timeout, api){
	$scope.data=$rootScope.data;
	$scope.clearMess=clearMess;
	$scope.normalizePhone = normalizePhone;
	$scope.$watch('data.phone.value', getWatchPhoneProc($scope));

	initData($scope.data); // сбросить все поля

	var temp=$scope.data.phone.value;
	$scope.data.phone.value='';
	$timeout(function(){
		$scope.data.phone.value=temp;
	}, 100);

	$scope.restore=function(){
		$scope.data.sended=true;
		$scope.data.formstate = 'sending';
		return api.call('/api/fr/localuser_restore', {username: $scope.data.phone.value}, true, true)
		.then(function(){
			toastr.success('Отправлено!');
			$scope.data.formstate = 'restored';
		}, function(){
			$scope.data.formstate = 'input';
		});
	};
});

angular.module('login').controller('login_error', function($scope, $rootScope, $timeout, $routeParams){
	$scope.data=$rootScope.data;
	$scope.data.number=$routeParams['number'];
});

angular.module('login').controller('login_registration', function($scope, $rootScope, $timeout, md5, api){
	$scope.data=$rootScope.data;
	initData($scope.data, false); // сбросить все поля (включая телефон)

	var something;
	$scope.init = function(some){
		something = some;
	};

	var temp=$scope.data.phone.value;
	$scope.data.phone.value='';
	$timeout(function(){
		$scope.data.phone.value=temp;
	}, 100);


	$scope.submit = function(){
		if(something && something.length==32){
			$('form#formid>input#login').val($scope.data.phone.value);
			$('form#formid>input#pass').val(md5.createHash(something+$scope.data.md5pass));
			$('form#formid').submit();
		}else{
			alert('Какая-то ошибка. Невозможно отправить регистрационные данные.');
		};
	};

	$scope.enter=function(){
		var login = normalizePhone($scope.data.phone.value);
		if(!$rootScope.arg) $rootScope.arg={};
		$rootScope.arg.login=login;
		document.location.href='#/form'
	}

	$scope.confirm=function(){
		$scope.data.mess1=false;
		$scope.clearMess();
		return api.call('/api/fr/contact_confirm', {idcontact: $scope.data.idcontact, code: $scope.data.confirmcode.value }, true, true)
		.then(function(result){
				$scope.data.formstate = 'ok';
				var to_users=0;
				if(result.takeoff){
					$scope.takeoff=result.takeoff;
					result.takeoff.rows.forEach(function(usr){
						to_users++;
					});
				};
				toastr.info("Контакт успешно подтверждён.");
				if(to_users>0){
					toastr.info("В процессе подтверждения выяснилось, что данный контакт был использован другими пользователями. Их ресурсы были захвачены в вашу пользу. Вы найдёте их в вашем  \"Личном кабинете\".");
				};
			
		}, function(error){
			$scope.data.formstate = 'confirmpart';
			toastr.error('Похоже, вы ошиблись при вводе кода. Повторите попытку.');
			$scope.clearMess();
		});
	};

	$scope.registrate=function(){
		var login = normalizePhone($scope.data.phone.value);
		$scope.data.md5pass = md5.createHash(login.toLowerCase()+$scope.data.pass1.value);
		$scope.data.formstate = 'sending';
		$scope.clearMess();

		return api.call('/api/user/add', {login: login, md5pass: $scope.data.md5pass, provider: 'settv'})
		.then(function(result){
			toastr.success('Пользователь создан.');
			if(result.idcontact>0){
				$scope.data.formstate = 'confirmpart';
				$scope.data.mess = 'На указанный телефон был отправлен код подтверждения. Дождитесь СМС и укажите код в поле выше.';
				//$scope.data.idcontact = result.rows[0].idcontact;
			}else{
				document.location.href='#/form'
			};
		}, function(error){
			if(error.error==110){
				$scope.data.mess1 = true;
				toastr.error('Занято');
			}else{
				toastr.error(error.message);
			};
			$scope.data.formstate = 'input';
		});
	};

	$scope.clearMess=clearMess;
	$scope.testPass1 = testPass1;
	$scope.testPass2 = testPass2;
	$scope.normalizePhone = normalizePhone;

	$scope.$watch('data.pass1.value', function(newval, oldval){
		if(newval!=oldval){
			$scope.testPass1(newval);
			$scope.testPass2($scope.data.pass2.value);
		};
	});

	$scope.$watch('data.pass2.value', function(newval, oldval){
		if(newval!=oldval){
			$scope.testPass2(newval);
		};
	});

	$scope.$watch('data.phone.value', getWatchPhoneProc($scope));

	$scope.$watch('data.email.value', function(newval, oldval){
		$scope.clearMess();
		if(newval!=oldval){
			if(newval.length<5) {
				$scope.data.email.isok=false;
			}else{
				if($scope.data.email.value.match(/[A-z0-9!#$%&'*+/=?^_`{|}~\.-]{1,64}\@[A-z0-9!#$%&'*+/=?^_`{|}~\.-]{2,64}\.[A-z0-9!#$%&'*+/=?^_`{|}~\.-]{2,64}?$/)){
					$scope.data.email.isok=true;
				}else{
					$scope.data.email.isok=false;
				}
			};
		};
	});

});

