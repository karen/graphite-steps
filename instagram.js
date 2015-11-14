'use strict';

var request = require('request');

var logger = require('./logger');
var winston = logger.winston;
var settings = require('./settings');

exports.subscribedTo = function(tagName, resolve, reject) {
  var subscriptions, data;
  request.get({url: settings.apiHost + "subscriptions?client_secret=" +
  settings.CLIENT_SECRET + "&client_id=" + settings.CLIENT_ID},
    function(err, response, body) {
      var code = response.statusCode;
      if (!err && code == 200) {
        subscriptions = JSON.parse(body);
        data = subscriptions.data;

        for (var i = 0; i < data.length; i++) {
          if (data[i].object_id === tagName) {
            reject('Already subscribed to the tag ' + tagName);
            return;
          }
        }

        resolve(tagName);
      } else {
        winston.warn(code + ": Error retrieving all subscriptions - " + err);
      }
    }
  );
};

exports.subscribeToTag = function(tagName) {
  var params = {
    client_id: settings.CLIENT_ID,
    client_secret: settings.CLIENT_SECRET,
    verify_token: 'tag-sub',
    object: "tag",
    aspect: "media",
    object_id: tagName,
    callback_url: "http://" + settings.host + "/callbacks/tag/" + tagName
  };

  request.post({url: settings.apiHost + "subscriptions", form: params},
    function(err, response, body) {
      if (!err && response.statusCode == 200) {
        winston.info("Subscribed to tag: ", tagName);
      }
      else {
        winston.warn("Failed to subscribe: ", response.statusCode, err);
      }
    }
  );
};

exports.unsubAll = function() {
  request.del({url: settings.apiHost + "subscriptions?client_secret=" +
  settings.CLIENT_SECRET + "&client_id=" + settings.CLIENT_ID + "&object=all"},
    function(err, response, body) {
      if (!err && response.statusCode == 200) {
        winston.info("Successfully unsubscribed from all tags");
      } else {
        winston.warn("Failed to unsubscribe: ", response.statusCode, err);
      }
    }
  );
};
