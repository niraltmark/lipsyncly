module.exports = function(mongoose, mongoStorage){
    
    var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

    var PlacesSchema = new Schema({
        name:       String,
        image:      String
    });

    mongoStorage.Models.Places = mongoose.model('places', PlacesSchema);
}

