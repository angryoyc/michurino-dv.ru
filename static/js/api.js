angular.module('api', []);
angular.module('api', []).factory('api', function($http, $q, $timeout){
	var self = {
		call: function(url, data, showmessages, andurl){
			return $http({
				method: 'POST',
				url: url,
				data: data
			})
			.then(
				function(response){
					if(response.data.error==0){
						return response.data.data;
					}else{
						var mess = 'Ошибка: ' + (andurl?('['+url+'] - '):'') + response.data.message;
						var err = new Error(mess);
						err.error=response.data.error;
						if(showmessages) {
							self.error(new Error(mess));
						};
						throw err;
					};
				},
				function(err){
					if(showmessages) {
						self.error({message:err.statusText});
					};
					throw err;
				}
			)
		},
		error: function(err){
			$timeout(function(){
				swal('ОШИБКА!', err.message || err.statusText, 'error');
			}, 100);
		}
	};
	return self;
})
