angular.module('api', []);
angular.module('api', []).factory('api', function($http, $q){
	var self = {
		call: function(url, data, showmessages, andurl){
			var deferred = $q.defer();
			
			$http({method: 'POST', data: data, url: url}).
			success(function(result, status, headers, config){
				if(result.error==0){
					deferred.resolve(result.data);
				}else{
					var mess = 'Ошибка: ' + (andurl?('['+url+'] - '):'') + result.message;
					if(showmessages) toastr.error(mess);
					deferred.reject(result);
				};
			}).
			error(function(result, status, headers, config) {
				var mess = 'Ошибка http (см. консоль.)';
				if(showmessages) toastr.error(mess);
				console.log(result);
				deferred.reject({error: 500, message:mess});
			});

			return deferred.promise;

		}
	};
	return self;
})
