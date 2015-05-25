module.exports = function() {

	return {
		
        execute : function(taskName, payload) {
            
            var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
				
				var iron_worker = require('iron_worker');
            	var worker = new iron_worker.Client({"token":process.env.IRON_WORKER_TOKEN,"project_id":process.env.IRON_WORKER_PROJECT_ID});

 				worker.tasksCreate(taskName, payload, {}, function(error, body) {
					 fulfill(body, error);
                }); 		
			});
		}
	}
}