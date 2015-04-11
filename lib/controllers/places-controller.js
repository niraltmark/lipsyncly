module.exports = function(app) {
    
    app.get("/places/get", function(request, response) {
        
        var placesProvider = require('lib/services/places-provider.js')();
        
        placesProvider.get().then(function(places) {
            response.json(places);
        });
    });
    
    app.post("/places/choose", function(request, response) {
        
        var ChoicesModel = require('lib/storages/mongo/mongo-storage.js').Models.Choices;

        console.log(request.body);
                console.log(request.body.place_name);

        var choice = new ChoicesModel(request.body);
        
        choice.save(function(result){
            response.end("OK");
        });
    });
}