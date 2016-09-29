angular.module('admin').controller('stead', function($scope, api){
	$scope.data = {};
	$scope.data.cost = 550;

	$scope.loadSteads=function(){
		api.call('/api/stead/list_ro', {}, true, true)
		.then(function(result){
			$scope.data.rows=result.rows;
		});
	};

	$scope.loadSteads();

	//-------- Показываем панель "Редактировать" -----------
	$scope.showPanelEdit=function(index, event){
		event.preventDefault();
		var stead = $scope.data.rows[index];
		$scope.data.curr=stead;
		$scope.data.curr_index=index;

		$scope.data.curr.center = $scope.calcCenter($scope.data.curr.points);

		$('#modal_edit').modal('show');
	};

	$scope.saveStead=function(){
		api.call('/api/stead/save', $scope.data.curr, true, true)
		.then(function(result){
			angular.extend($scope.data.curr, result)
			$('#modal_edit').modal('hide');
		});
	};

	$scope.calcStart=function(points){
		var ex = $scope.calcExtremums(points);
		return [(-1)*ex.min.x + 5, (-1)*ex.min.y + 5].join(',');
	}

	$scope.calcViewbox=function(points){
		var ex = $scope.calcExtremums(points);
		return [0, 0, (ex.max.x-ex.min.x) + 10, (ex.max.y - ex.min.y) + 10].join(' ');
	}

	$scope.calcExtremums=function(points){
		var max = {x:0, y:0};
		var min = {x:0, y:0};
		$scope.makePointsArray(points).reduce(function(prev, pair){
			var newval={x:(1*prev.x+1*pair.x), y: (1*prev.y + 1*pair.y)};
			if(newval.x>max.x) max.x=1*newval.x;
			if(newval.y>max.y) max.y=1*newval.y;
			if(newval.x<min.x) min.x=1*newval.x;
			if(newval.y<min.y) min.y=1*newval.x;
			return newval;
		}, {x:0, y:0});
		return {min:min, max:max};
	};

	$scope.makePointsArray=function(points){
		if(typeof(points)=='string' && points.length>0){
			return points.split(' ')
			.map(function(s_point){
				var a=s_point.split(',')
				return {x:1*a[0],y:1*a[1]};
			});
		}else{
			return [];
		}
	};

	$scope.calcCenter=function(points){
		var start = {x:0, y:0};
		var vertexes = [start];
		$scope.makePointsArray(points).reduce(function(prev, pair){
			var next = { x: (prev.x + pair.x), y: (prev.y + pair.y) };
			vertexes.push(next);
			return next;
		}, start);
		while($scope.getMaxSegLength(vertexes)>1){
			vertexes = $scope.getSegments(vertexes).map((seg)=>{return $scope.segmentCenter(seg)});
		};
		return (vertexes[0]);
	};

	$scope.getSegments=function(vertexes){
		var segments=[];
		vertexes.forEach((v,i)=>{
			segments.push({start:v, end:((i+1)>vertexes.length-1)?vertexes[0]:vertexes[i+1]});
		});
		return segments;
	};

	$scope.segmentCenter=function(seg){
		return {x:((seg.end.x+seg.start.x)/2), y:((seg.end.y+seg.start.y)/2)};
	};

	$scope.getMaxSegLength=function(vertexes){
		return $scope.getSegments(vertexes).reduce((prev, seg)=>{
			var l = $scope.getSegLength(seg);
			return (prev>l)?prev:l;
		}, 0);
	};

	$scope.getSegLength=function(seg){
		return Math.sqrt((seg.end.x-seg.start.x) * (seg.end.x-seg.start.x) + (seg.end.y-seg.start.y) * (seg.end.y-seg.start.y) );
	};

});
