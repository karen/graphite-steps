'use strict';

var request = require('request');
var crypto = require('crypto');

var logger = require('./logger');
var winston = logger.winston;
var settings = require('./settings');
var gph = require('./graphite');
var ig = require('./instagram');

/**
 * Verify if the request is really from Instagram
 * @param   request The request POSTed from Instagram
 * @return          boolean indicating if the request is from Instagram
 */
exports.isValidRequest = function isValidRequest(request) {
  var hmac = crypto.createHmac('sha1', settings.CLIENT_SECRET);
  hmac.update(request.rawBody);
  var providedSignature = request.headers['x-hub-signature'];
  var calculatedSignature = hmac.digest(encoding='hex');
  return providedSignature != calculatedSignature || !request.body;
};

/**
 * Retrieve the last igLimit (preset) photos tagged tagName, then
 * POST them using Graphite
 * @param   data The data POSTed from Instagram because of our subscription
 */

exports.queuePhotos = function queuePhotos(data) {
  var num_updates = settings.igLimit;
  var tagName = data.params.tagName;
  var update_url = settings.apiHost + "tags/" + tagName +
   "/media/recent?client_id=" + settings.CLIENT_ID + "&count=" + num_updates;
  request.get({url: update_url},
   function(err, res, body) {
     if (!err && res.statusCode == 200) {
       var instagram = JSON.parse(body);
       postInstagramData(instagram.data);
     } else {
       winston.error("Error retrieving latest photos: " + err);
     }
   });
};

/**
 * POST the photos we have retrieved using Graphite
 * @param   data The parsed Instagram data; an array of photos
 */
function postInstagramData(data) {
  var photoUrls = [];
  var usernames = [];
  var username;

  var headers, content;

  photoUrls = getUrlsFrom(data);
  usernames = getUsernamesFrom(data);

  headers = {
    'Authorization': 'Bearer ' + settings.GPH.AUTH_TOKEN,
  };

  for (var i = 0; i < photoUrls.length; i++) {
    content = {
      'storage_url': photoUrls[i]
    };

    username = usernames[i];

    gph.postAttachment(headers, content, username)
    .then(gph.postCustomer)
    .then(gph.postOrder, function(err){ winston.warn(err); });
  }
}

/**
 * Extract all the urls from the Instagram data
 * @param   data Parsed Instagram data; an array of photos
 * @return       An array of urls which can be POSTed to JX Print
 */

function getUrlsFrom(data) {
  var results = [];
  var img, url;
  for (var i = 0; i<data.length; i++) {
    img = data[i];
    url = img.images.standard_resolution.url;
    results.push(url);
  }
  return results;
}

function getUsernamesFrom(data) {
  var results = [];
  var img, username;
  for (var i = 0; i<data.length; i++) {
    img = data[i];
    username = img.user.username;
    results.push(username);
  }
  return results;
}
