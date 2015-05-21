module.exports = function() {

	var detectSilence = function(filename) {
     
        var Promise = require('promise');

        return new Promise(function(fulfill, reject) {
			
			var exec = require('inner_modules/exec')().exec;

			var silencedetectCommand = "ffmpeg -i " + filename + " -af silencedetect=n=-25dB:d=0.5 -f null -";

			exec(silencedetectCommand).then(function(stdout) {
				// For some reason the output is generated in stderr
				// We need to find the silence_duration: xxxxxx
				var rex = /silence_duration: (\d*\.?\d*)/;
				
				var result = rex.exec(stdout);
				
				// The result of exec is an array
				// The first object in the array is the whole result, for example 'silence_duration: 1.23242'
				// The second object is the grouped object from the regex
				if (result == null)
				{
					fulfill(0);
				}
				else
				{					
					var silenceDuration = result[1];
					
					console.log(silenceDuration);	
					
					fulfill(silenceDuration);	
				}	
			});
		});	
	};
	
	var trimStart = function(input, duration, output) {
		
		var Promise = require('promise');

        return new Promise(function(fulfill, reject) {
			
			// TODO : 	We need to get the FPS of the file that we just change in order to calculate the amount of frames to delete
			//			For now i know that it is hard coded 25 so i will use it
			//			The value of 0.04 is basically 1s / 25 (frames) = 0.04s
			var frameDuration = 0.04; // Time in seconds
			
			// If the duration is 5 seconds we will need to skip 125 frames
			var framesToSkip = Math.floor(duration / frameDuration); 
			
			var trimStartCommand = "ffmpeg -i " + input + ' -vf select="gte(n\, ' + framesToSkip + ')" -y ' + output;
			var exec = require('inner_modules/exec')().exec;
			
			exec(trimStartCommand).then(function(error, stdout, stderr) {
				fulfill(error, stdout, stderr);
			});
		});
	};
	
	var changeFps = function(input, fps, output){
	
		var Promise = require('promise');
		
		return new Promise(function(fulfill, reject){
			
			var changeFpsCommand = "ffmpeg -i " + input + " -r " + fps + " -y " + output
			
			var exec = require('inner_modules/exec')().exec;
			
			exec(changeFpsCommand).then(function(error, stdout, stderr) {
				fulfill(error, stdout, stderr);
			});
		});	
	};
	
	return {
        detectSilence: detectSilence,
		trimStart: trimStart,
		changeFps: changeFps,
		
		// TODO : add trim silence command
		
		mute : function(input, output) {
            
            var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
				
				var muteCommand  = "ffmpeg -i " + input + " -c copy -an -y " + output;	
				
				var exec = require('inner_modules/exec')().exec;
				
				exec(muteCommand).then(function(error, stdout, stderr) {
					fulfill(error, stdout, stderr);
				});
										
			});
		},
			
		split: function(input, segmentDuration) {
			
			var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
				
				var splitsCommands = [
					"ffmpeg -i " + input + ' -vf select="between(n\,0\,49)" -y output000.mp4',
					"ffmpeg -i " + input + ' -vf select="between(n\,50\99)" -y output001.mp4',
					"ffmpeg -i " + input + ' -vf select="between(n\,100\,149)" -y output002.mp4',
					"ffmpeg -i " + input + ' -vf select="between(n\,150\,199)" -y output003.mp4',
					"ffmpeg -i " + input + ' -vf select="between(n\,200\,249)" -y output004.mp4',
					"ffmpeg -i " + input + ' -vf select="between(n\,250\,299)" -y output005.mp4',
					"ffmpeg -i " + input + ' -vf select="between(n\,300\,349)" -y output006.mp4',
					"ffmpeg -i " + input + ' -vf select="between(n\,350\,399)" -y output007.mp4'
				];
							
				var exec = require('inner_modules/exec')().exec;
				
				exec(splitsCommands[0]).then(function() {
					exec(splitsCommands[1]).then(function() {
						exec(splitsCommands[2]).then(function() {
							exec(splitsCommands[3]).then(function() {
								exec(splitsCommands[4]).then(function() {
									exec(splitsCommands[5]).then(function() {
										exec(splitsCommands[6]).then(function() {
											exec(splitsCommands[7]).then(function() {
												fulfill();
											});
										});
									});
								});
							});
						});
					});
				});
			});
		}	
	}
}