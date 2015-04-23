module.exports = function(app) {
    
    app.post("/upload", function(request, response) {
        
        var transloaditResponse  = JSON.parse(request.body.transloadit);
        
        console.log(transloaditResponse);

        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;

        var upload = new UploadsModel({
            AssemblyId: transloaditResponse.assembly_id,
            FileUrl:    transloaditResponse.results.crop[0].url,
            StartPoint: "00:00:00",
            EndPoint:   "00:00:" + transloaditResponse.results.crop[0].meta.duration // This is really ugly way to persist the time
        });
        
        upload.save(function(result) {
            var iron_worker = require('iron_worker');
            var worker = new iron_worker.Client({"token":"d3mvmf9eVYSmDd7TxfrdX5x4nhc","project_id":"5537658df9335500060000c7"});

            var payload = { AssemblyId: upload.AssemblyId };
            var options = { priority: 1 };
            worker.tasksCreate('split_video_factory', payload, options, function(error, body) {
                console.log(error);
                console.log(body);
                
                response.end("OK");
            });
        });
    });
    
}