/*
* Модуль сервиса geom предназначенного для выполнения  геометрических вычислений помогающих при манипуляциями с SVG
*/

angular.module('geom', []);
angular.module('geom', []).factory('geom', function(){
	var self = {
		calcExtremums: function(points){
			var max = {x:0, y:0};
			var min = {x:0, y:0};
			self.makePointsArray(points).reduce(function(prev, pair){
				var newval={x:(1*prev.x+1*pair.x), y: (1*prev.y + 1*pair.y)};
				if(newval.x>max.x) max.x=1*newval.x;
				if(newval.y>max.y) max.y=1*newval.y;
				if(newval.x<min.x) min.x=1*newval.x;
				if(newval.y<min.y) min.y=1*newval.x;
				return newval;
			}, {x:0, y:0});
			return {min:min, max:max};
		},
		makePointsArray: function(points){
			if(typeof(points)=='string' && points.length>0){
				return points.split(' ')
				.map(function(s_point){
					var a=s_point.split(',')
					return {x:1*a[0],y:1*a[1]};
				});
			}else{
				return [];
			}
		},
		calcCenter: function(points, fromstart){
			var start;
			if(fromstart){
				var a = fromstart.split(',');
				start={x: 1*a[0], y:1*a[1]};
			}else{
				var ex = self.calcExtremums(points);
				start = {x: (-1) * (ex.min.x + 5), y: (-1) * (ex.min.y + 5)};
			};
			var vertexes = [start];
			self.makePointsArray(points).reduce(function(prev, pair){
				var next = { x: (prev.x + pair.x), y: (prev.y + pair.y) };
				vertexes.push(next);
				return next;
			}, start);
			while(self.getMaxSegLength(vertexes)>1){
				vertexes = self.getSegments(vertexes).map(function(seg){return self.segmentCenter(seg)});
			};
			return (vertexes[0]);
		},
		getSegments: function(vertexes){
			var segments=[];
			vertexes.forEach(function(v,i){
				segments.push({start:v, end:((i+1)>vertexes.length-1)?vertexes[0]:vertexes[i+1]});
			});
			return segments;
		},
		segmentCenter: function(seg){
			return {x:((seg.end.x+seg.start.x)/2), y:((seg.end.y+seg.start.y)/2)};
		},
		getMaxSegLength: function(vertexes){
			return self.getSegments(vertexes).reduce(function(prev, seg){
				var l = self.getSegLength(seg);
				return (prev>l)?prev:l;
			}, 0);
		},
		getSegLength: function(seg){
			return Math.sqrt((seg.end.x-seg.start.x) * (seg.end.x-seg.start.x) + (seg.end.y-seg.start.y) * (seg.end.y-seg.start.y) );
		}
	};
	return self;
});

