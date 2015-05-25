module.exports = function(app) {
      
    app.post("/upload", function(request, response) {
        
        var transloaditResponse  = JSON.parse(request.body.transloadit);
        
        console.log(transloaditResponse);

        // Get the file url from tranloaditResponse
        // In case that this is a regular run than the file url will be in [':original]
        // In case that we are replaying the assembly it will be in assembly_replay_import_file_0_0
        var fileUrl = "";
        if (transloaditResponse.results[':original'] == undefined) {
            fileUrl = transloaditResponse.results.assembly_replay_import_file_0_0[0].url;
        } else {
            fileUrl = transloaditResponse.results[':original'][0].url;
        }
 
        var ironWorker = require('lib/workers/iron-worker.js')();
        
        ironWorker.execute('video_splitter', {
            groupId:1, 
            fileUrl:fileUrl
        }).then(function(){response.end("OK");});
    });
}