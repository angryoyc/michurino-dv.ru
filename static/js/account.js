var account=angular.module('account', []);
angular.module('account', []).factory('password', function(){
	var self = {
		setTests: function($scope){
			$scope.testPass1 = self.getTestPass1($scope);
			$scope.testPass2 = self.getTestPass2($scope);
			$scope.$watch('data.pass1.value', self.getPass1Watcher($scope));
			$scope.$watch('data.pass2.value', self.getPass2Watcher($scope));

			if($scope.data.pass_old){
				$scope.testPass_old = self.getTestPass_old($scope);
				$scope.$watch('data.pass_old.value', self.getPass_oldWatcher($scope));
			};

		},

		getTestPass1: function($scope){
			return function(newval){
				if (typeof($scope.clearMess)=='function') $scope.clearMess();
				if(newval.length<3){
					//self.data.mess = 'слишком коротко'
					$scope.data.pass1.isok=false;
				}else{
					$scope.data.pass1.isok=true;
				};
				if($scope.data.pass1.isok && $scope.data.pass2.isok && $scope.data.pass_old.isok){
					$scope.data.pass_ok=true;
				}else{
					$scope.data.pass_ok=false;
				};
			};
		},

		getTestPass2: function($scope){
			return function(newval){
				if (typeof($scope.clearMess)=='function') $scope.clearMess();
				if(newval.length<3){
					$scope.data.pass2.isok=false;
				}else{
					if($scope.data.pass1.value==$scope.data.pass2.value){
						$scope.data.pass2.isok=true;
					}else{
						$scope.data.pass2.isok=false;
					};
				};
				if($scope.data.pass1.isok && $scope.data.pass2.isok && $scope.data.pass_old.isok){
					$scope.data.pass_ok=true;
				}else{
					$scope.data.pass_ok=false;
				};
			}
		},

		getTestPass_old: function($scope){
			return function(newval){
				if(newval.length<3){
					$scope.data.pass_old.isok=false;
				}else{
					$scope.data.pass_old.isok=true;
				};
				if($scope.data.pass1.isok && $scope.data.pass2.isok && $scope.data.pass_old.isok){
					$scope.data.pass_ok=true;
				}else{
					$scope.data.pass_ok=false;
				};
			}
		},

		getPass1Watcher: function($scope){
			return function(newval, oldval){
				if(newval!=oldval){
					$scope.testPass1(newval);
					$scope.testPass2($scope.data.pass2.value);
				};
			};
		},

		getPass2Watcher: function($scope){
			return function(newval, oldval){
				if(newval!=oldval){
					$scope.testPass2(newval);
				};
			};
		},

		getPass_oldWatcher: function($scope){
			return function(newval, oldval){
				if(newval!=oldval){
					$scope.testPass_old(newval);
				};
			};
		},

		normalizePhone: function(phone){
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
		},

		getWatchPhoneProc: function($scope){
			return function(newval, oldval){
				if (typeof($scope.clearMess)=='function') $scope.clearMess();
				if(newval!=oldval){
					var nv=self.normalizePhone(newval);
					/*
					if(nv.match(/^\+7\d{10}$/)) {
						$scope.data.phone.isok=true;
					}else{
						$scope.data.phone.isok=false;
					}
					*/
					$scope.data.phone.isok=self.isValidPhone(nv);
				};
			};
		},


		setPhoneTests: function($scope){
			$scope.$watch('data.phone.value', self.getWatchPhoneProc($scope));
			$scope.normalizePhone=self.normalizePhone;
		},

		isValidPhone: function(phone){
			if(phone.match(/^\+7\d{10}$/)) {
				return true;
			}else{
				return false;
			};
		},


		isValidEmail: function(email){
			if(!email || email.length<5) {
				return false;
			}else{
				if(email.match(/[A-z0-9!#$%&'*+/=?^_`{|}~\.-]{1,64}\@[A-z0-9!#$%&'*+/=?^_`{|}~\.-]{2,64}\.[A-z0-9!#$%&'*+/=?^_`{|}~\.-]{2,64}?$/)){
					return true;
				}else{
					return false;
				}
			};
		}

	};
	return self;
})
