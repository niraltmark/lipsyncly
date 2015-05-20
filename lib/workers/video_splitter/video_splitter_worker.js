/*
	While I prefer that each worker will have it's own small logic
	The most consuming part is starting the working, downloading and uploading the files
	Therefore I decided for now to run the whole split process in a single worker
	------------------------------------------------------------------------------------
	1. Silence detect
	2. Mute file
	3. Trim start
	4. Split
	5. Upload back to AWS S3
	------------------------------------------------------------------------------------
*/

require('rootpath')();      // Little helper to make node.js require relative to your project root

//var nodeHelper = require('node_helper');
//console.log("params:", nodeHelper.params);
//console.log("config:", nodeHelper.config);
//console.log("task_id:", nodeHelper.task_id);

var streamHandlers = require("inner_modules/streams-handler")();

var fileUrl  = "http://s3.amazonaws.com/lipsyncly/94/f37600fb0111e4ba615fd529eac650/input_slice.mp4";
var filename = "input.mp4";
var ffmpeg	= require("inner_modules/ffmpeg")();

var recursiveUpload = function(i) {
	var file = "output00" + i + ".mp4";
	
	console.log(file);
	
	streamHandlers.upload(file)
		.then(function(){ recursiveUpload(i + 1); })
		.reject(function(e){ console.log(file + " not found.",  e); })
};

//streamHandlers.download(fileUrl, filename)
//	.then(function() {
//		// TODO : Change the ffmpeg to fluent to make the code loveable
		ffmpeg.detectSilenct(filename).then(function(silenceDuration) {
			ffmpeg.mute(filename, "mute_" + filename).then(function() {
				ffmpeg.trimStart("mute_" + filename, "trim_" + filename, silenceDuration).then(function(){
					ffmpeg.split("trim_" + filename, 2).then(function() {
						
						console.log("done");
//						recursiveUpload(0);
							
					})
				})
			})
		});
//	});
