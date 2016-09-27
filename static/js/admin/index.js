angular.module('admin', ['ngRoute', 'ui.bootstrap', 'api', 'angular-md5', 'ui.bootstrap', 'ui.tinymce']);
	

angular.module('admin').config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/info',   {templateUrl: '/admin/info', controller: 'info'});
	$routeProvider.when('/users',   {templateUrl: '/admin/users', controller: 'users'});
	$routeProvider.when('/stead',   {templateUrl: '/admin/stead', controller: 'stead'});
	$routeProvider.otherwise({redirectTo: '/info'});
}]);

angular.module('admin').controller('index', function($scope, $rootScope){
});

