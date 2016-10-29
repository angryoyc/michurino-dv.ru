#!/usr/local/bin/node

var fs=require('fs');

fs.readFile('../static/svg/main_decorated_new_fit.svg', 'utf8', (err, data) => {
  if (err) throw err;
  var d=
  data
  .replace(/\n/g, ' ')
  .replace(/ +/g,' ')
  .match(/\sd\=\".+?\"/g) //"
  .filter(function(a, index, arr){
    return index>(arr.length-73);
  })
  .map(function(l){
  	var a=l.match(/\sd\=\"(.)\s(.+)\sz\"/) //"
  	return {p:a[2].split(/ /) 
	.map(function(p){
		return p.split(','); 
	}), letter: a[1]};
  })
  .map(function(fig){
  	if(fig.letter=='m'){
  		return fig;
  	}else{
  		var newp=[];
  		fig.p.forEach(function(p, i){
  			if(i>0){
  				var prev=fig.p[i-1];
  				newp.push([p[0]-prev[0],p[1]-prev[1]]);
	  		}else{
	  			newp.push(p);
	  		};
  		});
  		return {p:newp, letter:fig.letter};
  	}
  })
  .map(function(fig){
    return {start: fig.p[0].join(','), points: fig.p.filter((p,i)=>{return i>0}).map((p)=>{return p.join(',')}).join(' ') }
  })
  .map(function(path, i){
  	return 'update m.steads set start=\'' + path.start + '\', points=\'' + path.points + '\' where pp='+(i+1)+';'
  }).join('\n');

/*  
  .map(function(l){
	return l.match(/\sd\=\"m\s(.+)\sz\"/)[1].split(/ /)
	.map(function(p){
		return p.split(','); //"
	});
  })
  .map(function(fig){
    return {start: fig[0].join(','), points: fig.filter((p,i)=>{return i>0}).map((p)=>{return p.join(',')}).join(' ') }
  })
  .map(function(path, i){
  	return 'update m.steads set start=\'' + path.start + '\', points=\'' + path.points + '\' where pp='+(i+1)+';'
  }).join('\n');
*/
  ;
  console.log(d);
//  console.log(d.length);
});

