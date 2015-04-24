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
        // Lock by group id
        
        var transloaditResponse  = JSON.parse(request.body.transloadit);
        
        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;

        var upload = new UploadsModel({
            AssemblyId: transloaditResponse.assembly_id,
            FileUrl:    transloaditResponse.results.crop[0].url,
            StartPoint: transloaditResponse.params.fields.startPoint,
            GroupId:    transloaditResponse.params.fields.groupId,
            EndPoint:   "00:00:" + transloaditResponse.results.split_video[0].meta.duration, // This is really ugly way to persist the time
            Status:     "Splitted"
        });
        
        upload.save(function(result) {
           response.end("OK");
        });
        
                // Insert the splited video into the DB
        // check if we can merge the neightbours, but how?!?
        // Get the movies by group id (all of them)
        
        // Get the next video by the endPoint find a video with the same start point
        // Get the previous video by the endpoint of the current start point
        // Handle the boundaries
        // If status is not being merged than we can merge them
        
    });
    
    app.post("/merge-video-done", function(request, response) {
        
    });
    
    // This will be the code that is responsible for starting the process of spliting and merging the video
    app.get("/split-video-factory", function(request, response) {

        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;
        
        UploadsModel.find({ 'GroupId': request.query.groupId + "" }).exec(function(err, docs) {
            
            if (docs.length <= 1)
            {
                response.end('There is only 1 or less uploaded movie for ' + request.query.groupId);
            }
            else
            {
                
                console.log(docs.length);
                
                var date = new Date();
                var startPoint = Date.parse(date.toDateString() + " " + "00:00:00.000");

                var duration = 3000;
                
                var iron_worker = require('iron_worker');
                var worker = new iron_worker.Client({ "token": "d3mvmf9eVYSmDd7TxfrdX5x4nhc", "project_id": "5537658df9335500060000c7" });

                for (var i=0; i<docs.length;i++)
                {
                    var doc = docs[i];
                    var ffmpegStartpoint = ConvertMillisecondsToFfmpegDuration(startPoint);
                    var payload = { AssemblyId: doc.AssemblyId, StartPoint: ffmpegStartpoint, Duration: duration, SkipDuration: docs.length };
                    console.log(payload);
               
                    worker.tasksCreate('split_video_factory', payload, {}, function(error, body) {
                        console.log(error);
                        console.log(body);
                    }); 
                    
                    startPoint += duration;
                  }
                
                response.end("Starting splitting group " + request.query.groupId);
            }
        });
    });
    
    var ConvertMillisecondsToFfmpegDuration = function (milliseconds)
    {
        var date = new Date(milliseconds);

        return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds();
    }

}