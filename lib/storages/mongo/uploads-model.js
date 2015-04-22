module.exports = function(mongoose, mongoStorage){
    
    var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

    var UploadsSchema = new Schema({
        UserId:     String,
        SongId:     String,
        StartPoint: String,
        EndPoint:   String,
        AssemblyId: String,
        FileUrl:    String,
    });

    mongoStorage.Models.Uploads = mongoose.model('uploads', UploadsSchema);
}

