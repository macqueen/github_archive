var express = require('express');
var https = require('https');

var app = express();

app.use(express.bodyParser());

// headers
var headers = {
  'User-Agent': process.env.USERNAME,
  'Authorization': 'token ' + process.env.OAUTH_TOKEN,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE',
  'Access-Control-Allow-Credentials': true
};

// sample request for getting languages given a repo name + owner
var langReq = https.get({
    headers: headers,
    host: 'api.github.com',
    path: '/repos/rubinius/rubinius/languages'
  }, function(res){
  console.log('requests left', res.headers['x-ratelimit-remaining']);
  var result = '';
  res.on('data', function(d){
    result += d;
  });
  res.on('end', function(){
    console.log('****language sample result:', result);
  });
});

langReq.on('error', function(error){
  console.log('REQUEST ERROR', error);
});

// request for all public repos
var repoReq = https.get({
    headers: headers,
    host: 'api.github.com',
    path: '/repositories'
  }, function(res){
  console.log('requests left', res.headers['x-ratelimit-remaining']);
  var result = '';
  res.on('data', function(d){
    result += d;
    console.log('getting data.....');
  });
  res.on('end', function(){
    console.log('finish function called');
    var parsedResult = JSON.parse(result);
    console.log('parsed repos:', parseRepos(parsedResult));
  });
  res.on('error', function(error){
    console.log('RESPONSE ERROR: ', error);
  });
});

repoReq.on('error', function(error){
  console.log('REQUEST ERROR', error);
});


// helper function for extracting useful data from
// get all public repos request
var parseRepos = function(data){
  var results = [];
  for (var i = 0; i < data.length; i++) {
    if (!data[i].owner) {
      console.log('********owner undefined', data[i]);
    } else {
      results.push({
        fullname: data[i].full_name,
        owner_login: data[i].owner.login,
        name: data[i].name,
        languages_url: data[i].languages_url
      });
    }
  }
  return results;
}


app.listen(8000);
