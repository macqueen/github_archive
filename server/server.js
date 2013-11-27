var express = require('express');
var https = require('https');

var app = express();

app.use(express.bodyParser());

var options = {
  headers: {
    'User-Agent': process.env.USERNAME,
    'Authorization': 'token ' + process.env.OAUTH_TOKEN,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE',
    'Access-Control-Allow-Credentials': true
  },
  host: 'api.github.com',
  path: '/repos/rubinius/rubinius/languages'
};

https.get(options, function(res){
  console.log('requests left', res.headers['x-ratelimit-remaining']);
  var result = '';
	res.on('data', function(d){
    result += d;
    console.log(result);
	});
}).on('error', function(e){
	console.log('error', e);
});

app.listen(8000);
