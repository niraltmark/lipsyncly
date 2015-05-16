// ffmpeg
//	1. Silence detect
//	2. Mute file
//	3. Trim start
//	4. Split
//	5. Upload to AWS S3

module.exports = function() {

	return {
		
        detectSilenct: function(filename) {
            
            var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
				
				var exec = require('inner_modules/exec')().exec;
	
				var silencedetectCommand = "ffmpeg -i " + filename + " -af silencedetect=n=-25dB:d=1 -f null -";
	
				exec(silencedetectCommand).then(function(stdout) {
					// For some reason the output is generated in stderr
					// We need to find the silence_duration: xxxxxx
					var rex = /silence_duration: (\d*\.?\d*)/;
					
					var result = rex.exec(stdout);
					
					// The result of exec is an array
					// The first object in the array is the whole result, for example 'silence_duration: 1.23242'
					// The second object is the grouped object from the regex
					var silenceDuration = result[1];
					
					console.log(silenceDuration);	
					
					fulfill(silenceDuration);	
				});
		
			});
			
		},
		
		mute : function(input, output) {
            
            var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
				
				var muteCommand  = "ffmpeg -i " + input + " -c copy -an -y" + output;	
				
				var exec = require('inner_modules/exec')().exec;
				
				exec(muteCommand).then(function(error, stdout, stderr) {
					fulfill(error, stdout, stderr);
				});
										
			});
		},
		
		trimStart : function(input, output, duration) {
		
			var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
				
				var trimStartCommand = "ffmpeg -ss 00:00:0" + duration + " -i " + input + " -acodec copy -vcodec copy -async 1 -y " + output;
				
				var exec = require('inner_modules/exec')().exec;
				
				exec(trimStartCommand).then(function(error, stdout, stderr) {
					fulfill(error, stdout, stderr);
				});
										
			});
		},
		
		split: function(input, segmentDuration) {
			
			var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
				
				var splitCommand = 'ffmpeg -i ' + input + ' -c:v libx264 -crf 22 -map 0 -segment_time ' + segmentDuration + ' -g ' + segmentDuration + ' -sc_threshold 0 -force_key_frames "expr:gte(t,n_forced*' + segmentDuration + ')" -f segment output%03d.mp4';
				
				var exec = require('inner_modules/exec')().exec;
				
				exec(splitCommand).then(function(error, stdout, stderr) {
					fulfill(error, stdout, stderr);
				});
										
			});

		}
		
		
	}
}