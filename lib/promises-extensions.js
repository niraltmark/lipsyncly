module.exports = function() {

      var Promise = require('promise');
       
      Promise.sequence = function (promises, index)
      {
            if  (index == undefined)
            {
                  index = 0;
            }
            
            if (index == promises.length)
            {
                return new Promise(function(f,r){f()});
            }
            
            return new Promise(promises[index]).then(function(r) {    
                return Promise.sequence(promises, index + 1);
            });
      }
}