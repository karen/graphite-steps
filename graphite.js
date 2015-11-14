var request = require('request');

var settings = require('./settings');

exports.postAttachment = function (headers, content, resolve, reject) {
  var options;

  options = {
    headers: headers,
    uri: settings.GPH.POST_URL + 'attachments',
    body: content,
    json: true,
    method: 'POST'
  }

  setTimeout(function() {
    request(options, function (err, res, body) {
      if (!err && res.statusCode === 201) {
        attId = body.attachment.id;
        resolve(attId);
      } else {
        var reason = res.statusCode + ' ' + err;
        reject(reason);
      }
    });
  }, 1000)
}

exports.postOrder = function (attId) {
  var headers, content, options;

  headers = {
    'Authorization': 'Bearer ' + settings.GPH.AUTH_TOKEN,
  }

  content = {
    'customer_id': settings.GPH.CUSTOMER_ID,
    'shipping_address_id': settings.GPH.SHIPPING_ADDRESS_ID,
    'order_items': [{
      'combination_id': settings.GPH.COMBINATION_ID,
      'attachment_ids': attId }]
  }

  options = {
    headers: headers,
    url: settings.GPH.POST_URL + 'orders',
    body: content,
    json: true,
    method: 'POST'
  }

  setTimeout(function() {
    request(options, postOrderCallback);
  }, 1000);

}

function postOrderCallback(err, res, body) {
  var code = res.statusCode;

  if (!err && res.statusCode === 201){
    console.log('Posted order to Graphite', code, body);
  }
  else {
    console.log('Error posting order to Graphite', code, err);
  }
}
