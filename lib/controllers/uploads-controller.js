module.exports = function(app) {
    
    app.post("/upload", function(request, response) {
        
        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;

        var transloaditResponse  = JSON.parse(request.body.transloadit);

        var upload = new UploadsModel({
            AssemblyId: transloadit.assembly_id,
            FileUrl:    transloadit.results.encode[0].url
        });
        
        upload.save(function(result){
            response.end("OK");
        });
        
        response.end("OK");
    });
}