module.exports = function() {

	return {
		get : function(groupId, files) {
            var transloadit = require("lib/services/transloadit")();

            var delegates = [0,1,2,3,4,5,6,7].map(function(x) {
                
                // We are generating a delegate in the promise pattern so we can decide where and how to execute each split
                return function(fulfill, reject) {
                    transloadit
                        .split(groupId,
    		                  files[x % files.length],
    		                  50 * x,
    		                  50 * (x + 1) - 1,
    		                  "output00" + x + ".mp4")
                        .then(function(assmeblyId) {
                            var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;

                            var upload = new UploadsModel({ AssemblyId: assmeblyId, GroupId: groupId, Status: "Splitting" });
                        
                            console.log("Saving " + assmeblyId);
                            upload.save(function(result) {
                                fulfill();
                            });
                        });
             }});
             
             return delegates;     
        }
    }
};