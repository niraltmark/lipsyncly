module.exports = function(app) {
    
    app.post("/upload", function(request, response) {
        
        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;

        var upload = new UploadsModel({
            AssemblyId: "",
            FileUrl:    ""
        });
        
        upload.save(function(result){
            response.end("OK");
        });
    });
}