module.exports = function(app) {
      
    app.get("/fps-changed", function(request, response) {
        
        var transloaditResponse  = JSON.parse(request.body.transloadit);
        
        console.log(transloaditResponse);

        
        // Get the file url from tranloaditResponse
        // In case that this is a regular run than the file url will be in [':original]
        // In case that we are replaying the assembly it will be in assembly_replay_import_file_0_0
//        var fileUrl = "http://tmp-eu-west-1.transloadit.com.s3-eu-west-1.amazonaws.com/b14049b0008c11e5b475e1268849c8ec.mp4";
//        if (transloaditResponse.results['trim'] == undefined) {	
//            fileUrl = transloaditResponse.results.assembly_replay_import_file_0_0[0].url;
//        } else {
//            fileUrl = transloaditResponse.results['trim'][0].url;
//        }
        
        // TODO : Just store the file in mongo
        // We need to get the groupId from the parameters, i hope it is possible
        
//        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;
//
//        var upload = new UploadsModel({
//            AssemblyId: transloaditResponse.assembly_id,
//            FileUrl:    fileUrl
//        });
//        
//        upload.save(function(result) {});
    });
}