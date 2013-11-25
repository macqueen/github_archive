var express = require('express');
var https = require('https');

var app = express();

app.use(express.bodyParser());

https.get('https://api.github.com/repos/macqueen/github_archive/languages', function(res){

	res.on('data', function(d){
		process.stdout.write(d);
	});

}).on('error', function(e){
	console.log('error', e);
});

app.listen(8000);
