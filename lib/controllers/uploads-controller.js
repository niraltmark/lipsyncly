module.exports = function(app) {
    
    app.post("/upload", function(request, response) {
        
        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;

        var upload = new UploadsModel({
            AssemblyId: request.body.transloadit.assembly_id,
            FileUrl:    request.body.transloadit.results.encode[0].url
        });
        
        console.log(request.body.transloadit.results.encode[0].url);
        
        upload.save(function(result){
            response.end("OK");
        });
    });
}