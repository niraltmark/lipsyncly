/*
    The purpose of this code is to calculate the amount of tasks to execute in order to split a video to several parts
    We can execute just 1 task in transloadit but i prefer to split it for several tasks so we can monitor which one of them is not working
    and run it again if needed.
    
    This will execute split_video_worker which then execute the task in transloadit, so basically this will execute more tasks in ironworker
*/

function ConvertMillisecondsToFfmpegDuration(milliseconds)
{
    var date = new Date(milliseconds);
    
    return date.getHours() + ':' + date.getMinutes + ':' + date.getSeconds() + '.' + date.getMilliseconds();
}

try
{
//    var nodeHelper = require('node_helper');
//    console.log("params:", nodeHelper.params);
//    console.log("config:", nodeHelper.config);
//    console.log("task_id:", nodeHelper.task_id);

    // TODO : Get the file from the DB and calculate the time splits
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://ironworker:5Tuxermi@ds037597.mongolab.com:37597/heroku_app35779230');

    var Schema = mongoose.Schema;

    var UploadsSchema = new Schema({
        StartPoint: String,
        EndPoint:   String,
        AssemblyId: String,
        FileUrl:    String
    });

    var UploadsModel = mongoose.model('uploads', UploadsSchema);

    UploadsModel.find({ 'AssemblyId': 'b04283f0e87e11e4ad93c1cbaeff53de'/*nodeHelper.params.AssemblyId*/ }).exec(function(err, upload) { 
        console.log(upload);

        var date = new Date();
        var startPoint = Date.parse(date.toDateString() + " " + upload.StartPoint); // nodeHelper.params.StartPoint;
        var endPoint = Date.parse(date.toDateString() + " " + upload.EndPoint);
        
        var duration = nodeHelper.params.Duration; // Should be in milliseconds
        
        var iron_worker = require('iron_worker');
        var worker = new iron_worker.Client({"token":"d3mvmf9eVYSmDd7TxfrdX5x4nhc","project_id":"5537658df9335500060000c7"});
        
        while (startPoint < endPoint)
        {
            var payload = {
                AssemblyId: nodeHelper.AssemblyId,
                ss: ConvertMillisecondsToFfmpegDuration(startPoint),
                t: "00:00:03.000" // TODO : Convert the split duration to this format too, also here the duration will be 00:00:06.000
            };

            worker.tasksCreate('split_video', payload, {}, function(error, body) {
                console.log(error);
                console.log(body);
            });        
            
            startPoint += duration * nodeHelper.params.SkipDuration;
        }
        
        
        // Calculate the duration
        process.exit(0);
    });

}
catch (e)
{
    console.log("Error happen when trying to execute split_video_factory");
    console.log(e);
    process.exit(1);
}

// This is the 
//var TransloaditClient = require('transloadit');
//var transloadit       = new TransloaditClient({
//  authKey    : 'febb5ba0df6511e4b6c85b881c054f80',
//  authSecret : '8715b483383b5c141e07421914a8325a2f6e7ac5'
//});
//
//var assemblyOptions = {
//  params: {
//    template_id: 'f0fdc840e85711e4b608fdc694e171ba'
//  }
//};
//transloadit.createAssembly(assemblyOptions, function(err, result) {
//  if (err) {
//    throw new Error(err);
//  }
//
//  console.log('success');
////
////  var assemblyId = result.assembly_id;
////  console.log({
////    assemblyId: assemblyId
////  });
//
////  transloadit.deleteAssembly(assemblyId, function(err) {
////    console.log('deleted');
////  });
//});