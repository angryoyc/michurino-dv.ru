angular.module('admin').controller('gallery', function($scope, api, $rootScope, $timeout, $location){

	$scope.data = { rows:[], term:($rootScope.data?$rootScope.data.term:'') };

	$timeout(function(){
		$('#term').focus();
	}, 200);

	$scope.loadList = function(offset, event){
		var offs;
		if(typeof(offset)=='undefined'){
			offs = ($rootScope.data)?($rootScope.data.offset || 0):0;
		}else{
			offs = offset;
		};
		if(event) event.preventDefault();
		return api.call('/api/gallery/list_ro', {offset: offs, limit:10, term: $scope.data.term }, true, true)
		.then(function(result){
			$scope.data.rows   = result.rows;
			$scope.data.total  = result.total;
			$scope.data.pager  = result.pager;
			$scope.data.offset = result.offset;
			$scope.data.limit  = result.limit;
		});
	};

	$scope.$watch('data.term', function(oldval, newval){
		$scope.loadList();
	});

	// ДОБАВИТЬ
	$scope.add = function(){
		return api.call('/api/gallery/add', {title: $scope.data.term  || '--==новая галерея==--'}, true)
		.then(function(result){
			if(!$rootScope.data) $rootScope.data = {};
			$rootScope.data.offset = $scope.data.offset;
			$rootScope.data.term = $scope.data.term;
			$location.url('/gallery/edit/' + result.idgallery);
		});
	};


	// РЕДАКТИРОВАТЬ
	$scope.showEditPanel=function(index){
		var gallery = $scope.data.rows[index];
		if(!$rootScope.data) $rootScope.data = {};
		$rootScope.data.offset = $scope.data.offset;
		$rootScope.data.term = $scope.data.term;
		$location.url('/gallery/edit/' + gallery.idgallery);
	};

});

angular.module('admin').controller('gallery_edit', ['$scope', 'api', '$routeParams', '$rootScope', 'FileUploader', '$timeout', '$location', function($scope, api, $routeParams, $rootScope, FileUploader, $timeout, $location){

	var idgallery = $routeParams["idgallery"];

	$scope.stopEdit = function(){
		$location.url('/gallery');
	};


//- Файлы изображений
	$scope.uploader = new FileUploader();
	$scope.uploader.url               = '/api/file/uploader';
	$scope.uploader.alias             = 'ufile';
	$scope.uploader.formData          = [{idgallery:idgallery}];
	$scope.uploader.closed            = true;
	$scope.uploader.autoUpload        = true;
	$scope.uploader.removeAfterUpload = true;

	$scope.uploader.onSuccessItem=function(item, response, status, headers){
		if(response.error==0){
			$scope.data.curr.files = response.data.rows;
		}else{
			toastr.error(response.message);
		};
	};

	$scope.upload_all=function(){
		$scope.uploader.uploadAll();
	};

	$scope.ulink_image=function(f){
		return api.call('/api/gallery/file_unlink', { idgallery: $scope.data.curr.idgallery, idfile: f.idfile }, true)
		.then(function(result){
			$scope.data.curr.files = result.rows;
		});
		
	};

	$scope.data = { filter:[], root: $rootScope.data};

	$scope.tinymceOptions = {
		plugins: 'link image code',
		toolbar: 'fontsizeselect | undo redo | bold italic | alignleft aligncenter alignright alignjustify | code',
		fontsize_formats: '12pt 14pt 18pt 24pt 36pt 48pt 56pt',
		language: 'ru_RU',
		language_url: '/static/js/langs/timymce/ru_RU.js',
		menu: {
			edit: {title: 'Редактирование', items: 'undo redo | cut copy paste pastetext | selectall'},
			insert: {title: 'Вставить', items: 'link media image '},
			view: {title: 'Вид', items: 'visualaid'},
			format: {title: 'Формат', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
			table: {title: 'Таблица', items: 'inserttable tableprops deletetable | cell row column'},
			tools: {title: 'Инструменты', items: 'spellchecker code'}
		}
	};

	$scope.openFileDialog=function(){
		$('#imulated').trigger('click');
	};

//- Загрузка галереи и инициализации
	$scope.loadgalleryData = function(idgallery){
		return api.call('/api/gallery/info_ro', { idgallery: idgallery, allrubrics:true }, true)
		.then(function(result){
			$scope.data.curr=result;
			$scope.saveBak();
			return $scope.data.curr;
		});
	};

	$scope.loadgalleryData(idgallery)

	$scope.saveBak=function(){
		if($scope.data.curr){
			var bak = $scope.data.curr.bak = {};
			bak.title = $scope.data.curr.title;
			bak.note = $scope.data.curr.note;
			bak.enabled = $scope.data.curr.enabled;
		};
	};

	$scope.fileEditStart=function(file){
		file.edit={title: file.title || '', note: file.note || ''};
		$timeout(function(){$('#filetitle').focus()},100);
	};

	$scope.fileEditSave=function(file){
		return api.call('/api/file/update', { idfile:file.idfile, title:file.edit.title, note:file.edit.note }, true, true)
		.then(function(result){
			file.title = result.title;
			file.note = result.note;
			delete file.edit;
		});
	};


// # SAVE
	$scope.save = function(curr){
		return api.call('/api/gallery/save', {idgallery: curr.idgallery,  title: curr.title, note: curr.note, enabled: curr.enabled }, true, true)
		.then(function(result){
			if(result.saved){
				curr.title=result.title;
				curr.note=result.note;
				curr.enabled=result.enabled;
				$scope.saveBak();
			}else{
				swal("Полностью сохраниить новость не удалось", "error");
			}
		});
	};

	$scope.isNeedSave = function(curr){
		if($scope.data.curr){
			var bak = $scope.data.curr.bak;
			var curr = $scope.data.curr;
			return (bak.title != curr.title) || (bak.enabled != curr.enabled) || (bak.note != curr.note);
		}else{
			return false;
		};
	};

}]);
