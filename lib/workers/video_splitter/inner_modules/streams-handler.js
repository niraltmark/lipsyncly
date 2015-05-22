module.exports = function() {

	return {
		
        download: function(url, dest) {
            
            var Promise = require('promise');

            return new Promise(function(fulfill, reject) {
				var http = require('http');
				var fs = require('fs');	
				
				console.log("Starting to download " + url)
				var file = fs.createWriteStream(dest);
				http.get(url, function(response) {
					response.pipe(file);
					file.on('finish', function() {
						console.log("Finish to download " + url)
						file.close(fulfill);
					});
				});
			});
			
		},
		
		upload: function(bucket, outputFile){
			
			var Promise = require('promise');
			
			return new Promise(function(fulfill, reject){
				
				try {
					var AWS = 		require('aws-sdk');
					var zlib = 		require('zlib');
					var fs = 		require('fs');
					
					AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});
					var s3Stream =	require('s3-upload-stream')(new AWS.S3());

					// Create the streams 
					var read = fs.createReadStream(outputFile);
					var compress = zlib.createGzip();
					var upload = s3Stream.upload({ "Bucket": "lipsyncly/" + bucket, "Key": outputFile, "ContentType": 'video/mp4' });
					 
					upload.on('error', function (error) { 
						console.log(error); 
						reject(outputFile, error)
					});
					
					upload.on('part', function (details) { console.log(details); });
					upload.on('uploaded', function (details) { 
						console.log("Finish to upload " + outputFile);
						console.log(details);
						fulfill(outputFile, details);
					});
					
					// Pipe the incoming filestream through compression, and up to S3. 
					
					console.log("Starting to upload " + outputFile);
					read.pipe(upload);
				}
				catch (e) {
					console.log(e);
					
					reject(e);
				}
			});	
		}
	}
}