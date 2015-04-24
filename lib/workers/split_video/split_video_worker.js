/*
    The purpose of this worker is to simply call a task in transloadit
    This will execute split_video_worker which then execute the task in transloadit, so basically this will execute more tasks in ironworker
*/

function ConvertMillisecondsToFfmpegDuration(milliseconds)
{
    var date = new Date(milliseconds);
    
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds();
}

try
{
    var nodeHelper = require('node_helper');
    console.log("params:", nodeHelper.params);
    console.log("config:", nodeHelper.config);
    console.log("task_id:", nodeHelper.task_id);

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

    UploadsModel.find({ 'AssemblyId': nodeHelper.params.AssemblyId }).exec(function(err, docs) {
        
        if (docs.length != 1)
        {
            console.log("No uploads found (or there are too many) for assemblyId " + nodeHelper.params.AssemblyId);
            process.exit(1);
        }
        
        var upload = docs[0];
        console.log(upload);

        var TransloaditClient = require('transloadit');
        var transloadit       = new TransloaditClient({
            authKey    : 'febb5ba0df6511e4b6c85b881c054f80',
            authSecret : '8715b483383b5c141e07421914a8325a2f6e7ac5'
        });

        var assemblyOptions = {
            params: {
                template_id: 'f0fdc840e85711e4b608fdc694e171ba',
                steps: {
                    "file_import": {
                        "url": upload.FileUrl
                    },
                    "split_video" : {
                        "ffmpeg": {
                            "ss": nodeHelper.params.ss,
                            "t": nodeHelper.params.t
                        }
                    }
                },
                fields: {
                    nir: "altmark"
                },
                notify_url: "http://lipsyncly.herokuapp.com/split-video-done"
            }
        };
        
        transloadit.createAssembly(assemblyOptions, function(err, result) {
            if (err) {
                throw new Error(err);
            }

            console.log('success');
            var assemblyId = result.assembly_id;
            console.log({ assemblyId: assemblyId });

            process.exit(0);
        });
    });
}
catch (e)
{
    console.log("Error happen when trying to execute split_video_factory");
    console.log(e);
    process.exit(1);
}

// This is the 
