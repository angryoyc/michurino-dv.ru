#!/usr/local/bin/node

var fs=require('fs');

fs.readFile('../static/svg/main.svg', 'utf8', (err, data) => {
  if (err) throw err;
  var d=
  data
  .replace(/\n/g, ' ')
  .replace(/ +/g,' ')
  .match(/\sd\=\".+?\"/g) //"
  .filter(function(a, index){
    return index>4;
  })
  .map(function(l){
  	return l.match(/\sd\=\"[mM]\s(.+)\sz\"/)[1].split(/ /) //"
	.map(function(p){
		return p.split(','); 
	});
  })
  .map(function(fig){
    return {start: fig[0].join(','), points: fig.filter((p,i)=>{return i>0}).map((p)=>{return p.join(',')}).join(' ') }
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

