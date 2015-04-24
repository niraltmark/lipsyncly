module.exports = function(mongoose, mongoStorage){
    
    var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

    var UploadsSchema = new Schema({
        UserId:             ObjectId,   // The user who uploaded the content
        GroupId:            String,   // A movie is part of a huge group of users
        SongId:             ObjectId,   // Sometimes each group will generate a different songs but they are still the same group
        StartPoint:         String,     // The start point of the song that the user uploaded, for example if he started at the middle (will affect the algorithm)
        EndPoint:           String,     // End point of the record
        FileUrl:            String,     // The file video in some CDN, for example Amazon S3 or transloadit
        AssemblyId:         String,     // The AssemblyId in transloadit (Might need to change it to ExternalId)
        OriginalAssemblyId: String,     // The original movie before "touching" it
        State:              String      // The current state of the video, for example... being merged being split, splitted, merge
    });

    mongoStorage.Models.Uploads = mongoose.model('uploads', UploadsSchema);
}

