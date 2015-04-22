module.exports = function(app) {
    
    app.post("/upload", function(request, response) {
        
        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;

        console.log(request.body.transloadit);
        console.log(request.body.transloadit.results);

//
//        var upload = new UploadsModel({
//            AssemblyId: request.body.transloadit.assembly_id,
//            FileUrl:    request.body.transloadit.results.encode[0].url
//        });
//        
//        
//        upload.save(function(result){
//            response.end("OK");
//        });
        
        response.end("OK");
    });
}