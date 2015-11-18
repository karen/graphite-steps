'use strict';

var request = require('request');

var logger = require('./logger');
var winston = logger.winston;
var settings = require('./settings');

exports.postAttachment = function (headers, content, username) {
  var options;

  options = {
    headers: headers,
    uri: settings.GPH.POST_URL + 'attachments',
    body: content,
    json: true,
    method: 'POST'
  };

  var attId;

  var attPromise = new Promise(function(resolve, reject) {
    setTimeout(function() {
      request(options, function (err, res, body) {
        if (!err && res.statusCode === 201) {
          attId = body.attachment.id;
          resolve([username, attId]);
        } else {
          var reason = res.statusCode + ' ' + err;
          reject(reason);
        }
      });
    }, 1000);
  });
  return attPromise;
};

exports.postCustomer = function(pair) {
  var username = pair[0];
  var attId = pair[1];
  var headers, content, options;

  headers = {
    'Authorization': 'Bearer ' + settings.GPH.AUTH_TOKEN
  }

  content = {
    name: username,
    email: username + '@hello.com',
    contact_number: '999',
    shipping_addresses: [
      settings.GPH.SHIPPING_ADDRESS
    ]
  }

  options = {
    headers: headers,
    url: settings.GPH.POST_URL + 'customers',
    body: content,
    json: true,
    method: 'POST'
  }

  var customerId, shippingAddressId;

  var custPromise = new Promise(function(resolve, reject) {
    setTimeout(function() {
      request(options, function (err, res, body) {
        if (!err && res.statusCode === 201) {
          customerId = body.id;
          shippingAddressId = body.shipping_addresses[0].id;
          resolve([customerId, attId, shippingAddressId]);
        } else {
          reject(err);
        }
      });
    }, 1000);
  });

  return custPromise;
}

exports.postOrder = function (triplet) {
  var customerId = triplet[0];
  var attId = triplet[1];
  var shippingAddressId = triplet[2];
  var headers, content, options;

  headers = {
    'Authorization': 'Bearer ' + settings.GPH.AUTH_TOKEN
  };

  content = {
    'customer_id': customerId,
    'shipping_address_id': shippingAddressId,
    'order_items': [{
      'combination_id': settings.GPH.COMBINATION_ID,
      'attachment_ids': attId }]
  };

  options = {
    headers: headers,
    url: settings.GPH.POST_URL + 'orders',
    body: content,
    json: true,
    method: 'POST'
  };

  var orderUrl;

  var orderPromise = new Promise(function(resolve, reject) {
    setTimeout(function() {
      request(options, function(err, res, body) {
        if (!err && res.statusCode === 201) {
          orderUrl =  settings.GPH.DASHBOARD + body.order_id;
          resolve(body);
          winston.info('Posted order to Graphite: ', orderUrl);
        } else {
          reject(err);
          winston.error(code + ': Error posting order to Graphite - ' + err);
        }
      });
    }, 1000);
  });

  return orderPromise;
};
