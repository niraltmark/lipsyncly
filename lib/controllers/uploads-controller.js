module.exports = function(app) {
    
    app.post("/upload", function(request, response) {
        
        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;

        var transloaditResponse  = JSON.parse(request.body.transloadit);

        var upload = new UploadsModel({
            AssemblyId: transloaditResponse.assembly_id,
            FileUrl:    transloaditResponse.results.encode[0].url
        });
        
        upload.save(function(result){
            response.end("OK");
        });
        
        var ironWorkerClient = new require('iron_worker').Client({"token":"d3mvmf9eVYSmDd7TxfrdX5x4nhc","project_id":"5537658df9335500060000c7"});
        
        var payload = {first: 'Hello', second: 'World'};
        var options = {priority: 1};
        ironWorkerClient.tasksCreate('split_video', payload, options, function(error, body) {
            console.log(error);
            console.log(body);
        });
    });
}