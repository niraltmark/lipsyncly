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
	
	var concat = function(list, output) {

        var Promise = require('promise');
		
		return new Promise(function(fulfill, reject) {
			
			var exec = require('inner_modules/exec')().exec;

			var concatCommand = "ffmpeg -f concat -i " + list + " -c copy -metadata:s:v:0 rotate=0 " +  output;

			exec(concatCommand).then(function(stdout) {
				fulfill();
			});
		});	
	};
	
	var addSound = function(input, sound, output) {
		var Promise = require('promise');
		
		return new Promise(function(fulfill, reject) {
			var exec = require('inner_modules/exec')().exec;
			
			var mergeSoundCommand = "ffmpeg -i " + input + " -i " + sound + " -c:v copy -c:a aac -strict experimental " + output;
		
			exec(mergeSoundCommand).then(function(){
				fulfill();
			});
		});
	};
	
	
	return {
        detectSilence: detectSilence,
		concat: concat,
		addSound: addSound,
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
		}	
	}
}