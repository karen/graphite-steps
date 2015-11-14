var express = require('express');
var http = require('http');
var url = require('url');

var settings = require('./settings');
var helpers = require('./helpers');

var app = settings.app;

app.get('/', function(req, res) {
  res.json({success: true});
});

app.get('/callbacks/tag/:tagName', function(req, response) {
  if (req.params("hub.verify_token") == "tag-sub") {
    console.log('token verified')
    response.send(req.params("hub.challenge"));
  } else {
    console.log('token not verified')
    response.status(500).json({error: 'Incorrect verify_token'});
  }
});

app.post('/callbacks/tag/:tagName', function(req, response) {
  if (!helpers.isValidRequest(request)) {
    response.status(500).json({error: 'Signature does not match'});
  } else {
    console.log('Instagram posted: ' + req);
    response.json({success: true});
    helpers.queuePhotos(req);
  }
})

helpers.subscribeToTag('graphite-steps');
// helpers.unsubAll();

app.listen(settings.port);
