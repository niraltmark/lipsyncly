require('rootpath')();      // Little helper to make node.js require relative to your project root
//
//var nodeHelper = require('node_helper');
//console.log("params:", nodeHelper.params);
//console.log("config:", nodeHelper.config);
//console.log("task_id:", nodeHelper.task_id);
var nodeHelper = {
	params: {
		groupId : 1,
		files: ['http://s3.amazonaws.com/lipsyncly/1/originals/17429000007511e5af31bfce3b336ac3.mp4']
	}	
};

var streamHandlers = require("inner_modules/streams-handler")();

var transloadit = require("inner_modules/transloadit")();

var splitDelegates = [0,1,2,3,4,5,6,7].map(function(x) {
	return transloadit.split(nodeHelper.params.groupId,
		nodeHelper.params.files[x % nodeHelper.params.files.length],
		50 * x,
		50 * (x + 1) - 1,
		"output00" + x + ".mp4");
});

var Promise = require('promise');

Promise.all(splitDelegates).then(function()
{
	console.log("done");
	
	// TODO : Create a list of the files
	// Download all the file from S3, can also happen in the background
	// Execute the merge command
	// Execute the merge with sound command
});
