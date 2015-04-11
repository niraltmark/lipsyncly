module.exports = function() {

    return {
        get: function() {
            
            var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
                var placesMongoStorage = require("lib/storages/mongo/places-mongo-storage.js")();

                placesMongoStorage.get().then(function(places) {
                    fulfill(places);
                });
                
            });
        }
    }
}
