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
//
//var nodeHelper = require('node_helper');
//console.log("params:", nodeHelper.params);
//console.log("config:", nodeHelper.config);
//console.log("task_id:", nodeHelper.task_id);


//var streamHandlers = require("inner_modules/streams-handler")();

//var fileUrl  = nodeHelper.params.fileUrl;
var filename = "input.mp4";
var ffmpeg	= require("inner_modules/ffmpeg")();

var recursiveUpload = function(i) {
	
	var file = "output00" + i + ".mp4";
	
	console.log(file);
	
//	streamHandlers.upload(nodeHelper.params.groupId + "/" + nodeHelper.params.videoId, file, nodeHelper.params.awsAccessKey, nodeHelper.params.awsSecretKey)
//		.then(function(){ recursiveUpload(i + 1); })
//		.reject(function(e){ console.log(file + " not found.",  e); })
};

//streamHandlers.download(fileUrl, filename)
//	.then(function() {
//		streamHandlers.upload(nodeHelper.params.groupId + "/" + nodeHelper.params.videoId, filename, nodeHelper.params.awsAccessKey, nodeHelper.params.awsSecretKey);
		
//		 TODO : Change the ffmpeg to fluent to make the code loveable
		ffmpeg.detectSilence(filename).then(function(duration){
			ffmpeg.mute(filename, "mute_" + filename).then(function(){
				ffmpeg.changeFps("mute_" + filename, 25, "25fps_" + filename).then(function() {
					ffmpeg.trimStart("25fps_" + filename, duration, "trim_" + filename).then(function() {
						ffmpeg.split("trim_" + filename, 2).then(function() {
							console.log("done");
//					streamHandlers.upload(nodeHelper.params.groupId + "/" + nodeHelper.params.videoId, "output000.mp4", nodeHelper.params.awsAccessKey, nodeHelper.params.awsSecretKey);					
						});
						// Split
					});
				});
			});
		});
//	});