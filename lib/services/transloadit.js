module.exports = function() {

	return {
		
        split: function(groupId, fileUrl, startFrame, endFrame, output) {
            
            var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
					
				// Lets upload to transloadit instead of S3, at least for now
				var TransloaditClient = require('transloadit');
				var transloadit       = new TransloaditClient({
				  authKey    : process.env.TRANSLOADIT_AUTH_KEY,
				  authSecret : process.env.TRANSLOADIT_AUTH_SECRET
	  			});
	
				var assemblyOptions = {
					params: {
						template_id: 'e1f09c70008911e5b1579f090776867b'
					},
					fields: {
						groupId: groupId,
						fileUrl: fileUrl,
						start: startFrame,
						end: endFrame,
						output: output
					}
				};
				
				console.log("Creating assmenly...", assemblyOptions.fields);
				
				transloadit.createAssembly(assemblyOptions, function(err, result) {
					if (err) {
						console.log("Something bad happen with ");
						console.log(assemblyOptions);
						throw new Error(err);
					}
					
					console.log("Assembly " + result.assembly_id + " created.");
										
					fulfill(result.assembly_id)
				});
			});
		}
	}
}