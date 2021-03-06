angular.module('admin', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'api', 'angular-md5', 'ui.tinymce', 'geom', 'ui.tinymce', 'angularFileUpload']);
	
angular.module('admin').config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/info',   {templateUrl: '/admin/info', controller: 'info'});
	$routeProvider.when('/users',   {templateUrl: '/admin/users', controller: 'users'});
	$routeProvider.when('/stead',   {templateUrl: '/admin/stead', controller: 'stead'});
	$routeProvider.when('/claims',   {templateUrl: '/admin/claims', controller: 'claims'});
	$routeProvider.when('/reserves',   {templateUrl: '/admin/reserves', controller: 'reserves'});
	$routeProvider.when('/gallery',   {templateUrl: '/admin/gallery', controller: 'gallery'});
	$routeProvider.when('/params',   {templateUrl: '/admin/params', controller: 'params'});
	$routeProvider.when('/gallery/edit/:idgallery?',   {templateUrl: '/admin/gallery/edit', controller: 'gallery_edit'});
	$routeProvider.otherwise({redirectTo: '/info'});
}]);

angular.module('admin').controller('index', function($scope, $rootScope){
});

