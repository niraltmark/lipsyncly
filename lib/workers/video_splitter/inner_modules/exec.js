module.exports = function() {

	return {
		
        exec: function(command) {
            
            var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
				
				var exec = require('shelljs').exec;
	
				console.log(new Date() + " - Exectuing " + command);
				
				var result = exec(command, {silent:process.env.EXEC_SILENT_MODE});

				console.log(new Date() + " - Finish executing " + command);
				
				fulfill(result.output);
				
			});
		}
			
	}
}