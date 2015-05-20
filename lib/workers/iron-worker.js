module.exports = function() {

	return {
		
        execute : function(taskName, payload) {
            
            var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
				
				var iron_worker = require('iron_worker');
            	var worker = new iron_worker.Client({"token":"d3mvmf9eVYSmDd7TxfrdX5x4nhc","project_id":"5537658df9335500060000c7"});

 				worker.tasksCreate(taskName, payload, {}, function(error, body) {
					 fulfill(body, error);
                }); 		
			});
		}
	}
}