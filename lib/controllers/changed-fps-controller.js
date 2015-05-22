module.exports = function(app) {
      
    app.get("/fps-changed", function(request, response) {
        
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
        
        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;

        var upload = new UploadsModel({
            AssemblyId: transloaditResponse.assembly_id,
            FileUrl:    fileUrl,
            GroupId:    transloaditResponse.fields.groupId
        });
        
        upload.save(function(result) {
            response.end("OK");
        });
    });
    
}