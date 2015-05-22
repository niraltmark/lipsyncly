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

//var fileUrl  = nodeHelper.params.fileUrl;
var filename = "input.mp4";
var ffmpeg	= require("inner_modules/ffmpeg")();

// streamHandlers.download(fileUrl, filename).then(function() {
	// TODO : Change the ffmpeg to fluent to make the code loveable
	ffmpeg.detectSilence(filename).then(function(duration){
		ffmpeg.mute(filename, "mute_" + filename).then(function() {
			// Lets upload to transloadit instead of S3, at least for now
			var TransloaditClient = require('transloadit');
			var transloadit       = new TransloaditClient({
			  authKey    : process.env.TRANSLOADIT_AUTH_KEY,
			  authSecret : process.env.TRANSLOADIT_AUTH_SECRET
  			});
			  
			// TODO : 	We need to get the FPS of the file that we just change in order to calculate the amount of frames to delete
			//			For now i know that it is hard coded 25 so i will use it
			//			The value of 0.04 is basically 1s / 25 (frames) = 0.04s
			var frameDuration = 0.04; // Time in seconds
			
			// If the duration is 5 seconds we will need to skip 125 frames
			var framesToSkip = Math.floor(duration / frameDuration); 
			  
		  	transloadit.addFile('input', "mute_" + filename);
			var assemblyOptions = {
				params: {
					template_id: '0a973870007e11e5a3fa07e97b401438',
					notify_url: 'http://lipsyncly.herokuapp.com/fps-changed'
				},
				fields: {
					framesToSkip: framesToSkip
				}
			};
			
			transloadit.createAssembly(assemblyOptions, function(err, result) {
				if (err) {
					throw new Error(err);
				}
				
				console.log('success');
				
				var assemblyId = result.assembly_id;
				console.log({assemblyId: assemblyId});
			});
		});
	});
// });