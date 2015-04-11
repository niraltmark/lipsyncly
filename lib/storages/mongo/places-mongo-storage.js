module.exports = function() {

    return {
    
        get: function() {
        
            var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
               
                var mongoStorage = require("lib/storages/mongo/mongo-storage.js");

                var PlacesModel = mongoStorage.Models.Places;

                PlacesModel.find({}).exec(function(err, places) { 

                    fulfill(places);

                });
            });
        }
    };
}