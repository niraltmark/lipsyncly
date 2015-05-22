module.exports = function(app) {
      
    app.post("/fps-changed", function(request, response) {
        
        var transloaditResponse  = JSON.parse(request.body.transloadit);
        
        console.log(transloaditResponse);

        // Get the file url from tranloaditResponse
        // In case that this is a regular run than the file url will be in [':original]
        // In case that we are replaying the assembly it will be in assembly_replay_import_file_0_0
        var fileUrl = "";
        if (transloaditResponse.results['trim'] == undefined) {
            fileUrl = transloaditResponse.results.assembly_replay_import_file_0_0[0].url;
        } else {
            fileUrl = transloaditResponse.results['trim'][0].url;
        }
        
        // TODO : We have a trim file with 25 FPS we now going to call split the file to 4 files
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
					fileUrl: fileUrl,
					start: 0,
					end: 49
				}
			};
			
			transloadit.createAssembly(assemblyOptions, function(err, result) {
				if (err) {
					throw new Error(err);
				}
				
				console.log('success');
				
				var assemblyId = result.assembly_id;
				console.log({assemblyId: assemblyId});
				
				response.end(assemblyId);
			});
       
    });
}