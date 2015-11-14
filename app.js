'use strict';

var express = require('express');
var http = require('http');
var url = require('url');

var logger = require('./logger');
var winston = logger.winston;
var settings = require('./settings');
var helpers = require('./helpers');
var ig = require('./instagram');

var app = settings.app;

app.get('/', function(req, res) {
  res.json({success: true});
});

app.get('/callbacks/tag/:tagName', function(req, response) {
  if (req.params("hub.verify_token") == "tag-sub") {
    response.send(req.params("hub.challenge"));
  } else {
    response.status(500).json({error: 'Incorrect verify_token'});
  }
});

app.post('/callbacks/tag/:tagName', function(req, response) {
  if (!helpers.isValidRequest(request)) {
    response.status(500).json({error: 'Signature does not match'});
  } else {
    response.status(200).json({success: true});
    helpers.queuePhotos(req);
  }
});

if (settings.appSub) {
  winston.verbose('Starting up app...');
  var listSub = new Promise(function(resolve, reject) {
    ig.subscribedTo(settings.igTag, resolve, reject);
  });
   listSub
   .then(ig.subscribeToTag, function(reason){ winston.info(reason); });
 } else {
   winston.info('Unsubscribing from all tags!');
   ig.unsubAll();
 }

app.listen(settings.port);
