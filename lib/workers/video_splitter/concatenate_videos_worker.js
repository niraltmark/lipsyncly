require('rootpath')();      // Little helper to make node.js require relative to your project root

var nodeHelper = require('node_helper');
console.log("params:", nodeHelper.params);
console.log("config:", nodeHelper.config);
console.log("task_id:", nodeHelper.task_id);

var streamHandlers = require("inner_modules/streams-handler")();

var files = nodeHelper.params.files;
//[
//	{url:'http://lipsyncly.s3.amazonaws.com/1/output000.mp4',name:'output000.mp4'},
//	{url:'http://lipsyncly.s3.amazonaws.com/1/output001.mp4',name:'output001.mp4'},
//	{url:'http://lipsyncly.s3.amazonaws.com/1/output002.mp4',name:'output002.mp4'},
//	{url:'http://lipsyncly.s3.amazonaws.com/1/output003.mp4',name:'output003.mp4'},
//	{url:'http://lipsyncly.s3.amazonaws.com/1/output004.mp4',name:'output004.mp4'}
//];

var Promise = require('promise');
require('inner_modules/promises-extensions')();
            
Promise.sequence(files.map(x => streamHandlers.downloadDelegate(x.url, x.name))).then(function() {
	var fs = require('fs');
	var stream = fs.createWriteStream("concat.list");
	stream.once('close', function(fd) {
		var ffmpeg = require('inner_modules/ffmpeg')();
		ffmpeg.concat('concat.list', 'output.mp4').then(function() {
			streamHandlers.download("http://lipsyncly.s3.amazonaws.com/uptown-funk.mp3", "song.mp3").then(function(){
				ffmpeg.addSound('output.mp4', 'song.mp3','final.mp4').then(function(){
					streamHandlers.upload("1", "final.mp4").then(function(){
						console.log("Done");
					})
				});			
			});
		});
	});
	
	stream.once('open', function(fd) { 
		for (var i=0; i < files.length; i++)
		{
			stream.write('file ' + files[i].name + '\n'); 
		}
		stream.end();
	});
});

