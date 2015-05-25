 module.exports = function(app) {
     app.get("/split-videos", function(request, response) {
         
         // TODO : Initilize the queue per gropuId
         // We will need to initilize the queue per group in the future
         // require('lib/services/videos-queue');
         
         var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;
         
         // TODO : Now we have more files with groupId, we need to run a different query
         UploadsModel.find({ 'GroupId': request.query.groupId + "" }).exec(function(err, docs) {
            
            if (docs.length <= 1)
            {
                response.end('There is only 1 or less uploaded movie for ' + request.query.groupId);
            }
            else
            {
                var delegates = require('lib/services/splits-delegates-provider')()
                    .get(request.query.groupId, docs.map(x => x.FileUrl));
                
                var Promise = require('promise');
                require('lib/promises-extensions')();
                
                Promise.sequence(delegates).then(function() {
                    response.end("Executing tasks in transloadit"); 
                });
            }
        });
     });
      
    app.post("/video-splitted", function(request, response) {
        
        var transloaditResponse  = JSON.parse(request.body.transloadit);
        
        console.log(transloaditResponse);

        // Get the file url from tranloaditResponse
        // In case that this is a regular run than the file url will be in [':original]
        // In case that we are replaying the assembly it will be in assembly_replay_import_file_0_0
        var fileUrl = "";
        if (transloaditResponse.results['split'] == undefined) {
            fileUrl = transloaditResponse.results.assembly_replay_import_file_0_0[0].url;
        } else {
            fileUrl = transloaditResponse.results['split'][0].url;
        }
        
        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;
        
        var assmeblyId = transloaditResponse.assembly_id;

        UploadsModel.find({ 'AssemblyId':  assmeblyId + "" }).exec(function(err, docs) {
            var doc = docs[0];
            doc.Status = "OK";
            doc.FileUrl = fileUrl;
         
            console.log(doc);
            doc.save(function(result) {
                
                var queue = require('lib/services/videos-queue').queue;
                
                queue.push(function(task){
                   UploadsModel.find({'GroupId': doc.GroupId, 'Status':'Splitting'}).exec(function(_, results) {
                       
                       if (results.length != 0)
                       {
                           console.log("There are still videos to split :(");   
                       }
                       else
                       {                           
                           console.log("need to execute merge :)");   
                       }
                       
                        // TODO : If there are un done videos than task.done()
                        // Else, need to execute a task in iron worker to merge the videos
                        
                       task.done();
                   });
                });
                
                response.end("OK");                      
            });
            
        });
    });
}