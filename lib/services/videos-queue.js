module.exports = new function() {

	var seqqueue = require('seq-queue');
	 
	this.queue = seqqueue.createQueue(1000);
};