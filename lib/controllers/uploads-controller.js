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
           response.end("OK");
        });
    });
    
    app.post("/split-video-done", function(request,response) { 
        // TODO : Check if we can merge neighbour videos we need to cal ironworker code and merge 3 videos
        // Persist the new video and in mongo
        
    });
    
    app.post("/merge-video-done", function(request, response) {
        
    });
    
    // This will be the code that is responsible for starting the process of spliting and merging the video
    app.get("/split-video-factory", function(request, response) {

        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;
        
        UploadsModel.find({ 'GroupId': request.query.groupId }).exec(function(err, docs) {
            
            if (docs.length == 1)
            {
                response.end('There is only 1 uploaded movie for ' + request.query.groupId);
            }
            else
            {
                var date = new Date();
                var startPoint = Date.parse(date.toDateString() + " " + upload.StartPoint);

                var duration = 3000;
                
                var iron_worker = require('iron_worker');
                var worker = new iron_worker.Client({ "token": "d3mvmf9eVYSmDd7TxfrdX5x4nhc", "project_id": "5537658df9335500060000c7" });

                for (var doc in docs)
                {
                    var payload = { AssemblyId: doc.AssemblyId, StartPoint: ConvertMillisecondsToFfmpegDuration(startPoint), Duration: duration, SkipDuration: docs.length };
                    worker.tasksCreate('split_video_factory', payload, {}, function(error, body) {
                        console.log(error);
                        console.log(body);
                    }); 
                    
                    startPoint += duration;
                }
            }
            
        });
        
    });
    
    function ConvertMillisecondsToFfmpegDuration(milliseconds)
    {
        var date = new Date(milliseconds);

        return date.getHours() + ':' + date.getMinutes + ':' + date.getSeconds() + '.' + date.getMilliseconds();
    }

}