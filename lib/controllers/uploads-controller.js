module.exports = function(app) {
    
    app.post("/upload", function(request, response) {
        
        var UploadsModel = require('lib/storages/mongo/mongo-storage.js').Models.Uploads;

        try {console.log(request.body.transloadit);}catch {console.log("error");}
        try {console.log(request.body.transloadit.ok);}catch {console.log("error");}
        try {console.log(request.body.transloadit["ok"]);}catch {console.log("error");}
        try {console.log(eval(request.body.transloadit).results);}catch {console.log("error");}

//
//        var upload = new UploadsModel({
//            AssemblyId: request.body.transloadit.assembly_id,
//            FileUrl:    request.body.transloadit.results.encode[0].url
//        });
//        
//        
//        upload.save(function(result){
//            response.end("OK");
//        });
        
        response.end("OK");
    });
}