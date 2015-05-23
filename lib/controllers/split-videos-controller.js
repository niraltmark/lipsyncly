module.exports = function(app) {
      
    app.get("/split-videos", function(request, response) {
        
        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;
       
//       // TODO : Now we have more files with groupId, we need to run a different query
//        UploadsModel.find({ 'GroupId': request.query.groupId + "" }).exec(function(err, docs) {
//            
//            if (docs.length <= 1)
//            {
//                response.end('There is only 1 or less uploaded movie for ' + request.query.groupId);
//            }
//            else
//            {
                var Promise = require("promise");
                var transloadit = require("lib/services/transloadit")();

//                var filesUrls = docs.map(x => x.FileUrl);
                var filesUrls = ['http://s3.amazonaws.com/lipsyncly/1/originals/17429000007511e5af31bfce3b336ac3.mp4'];
                var splitDelegates = [0,1,2,3,4,5,6,7].map(function(x) {
                    return new Promise(function(fulfill, reject) {
                        transloadit
                            .split(request.query.groupId,
        		                  filesUrls[x % filesUrls.length],
        		                  50 * x,
        		                  50 * (x + 1) - 1,
        		                  "output00" + x + ".mp4")
                            .then(function(assmeblyId){
                                var upload = new UploadsModel({ AssemblyId: assmeblyId, GroupId: request.query.groupId, Status: "Spliting" });
                            
                                upload.save(function(result) {
                                    fulfill();
                                });
                            });
                    });
                });
                
                Promise.all(splitDelegates).then(function() {
                   response.end("Executing tasks in transloadit"); 
                });
//            }
//        });
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
       
       UploadsModel.find({ 'AssemblyId': transloaditResponse.assembly_id + "" }).exec(function(err, docs) {
            var doc = docs[0];
            
            doc.Status = "OK";
 
            var upload = new UploadsModel(doc);
            upload.save(function(result) {
                
                response.end("OK");
                
            });
        
        });
    });
}