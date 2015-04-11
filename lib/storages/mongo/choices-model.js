module.exports = function(mongoose, mongoStorage){
    
    var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

    var ChoicesSchema = new Schema({
        place_id:       ObjectId,
        place_name:     String,
        username:       String,
        choice:         String,
        date:           { type: Date, default: Date.now }
    });

    mongoStorage.Models.Choices = mongoose.model('choices', ChoicesSchema);
}

