var request = require('request');
var crypto = require('crypto');

var settings = require('./settings');


exports.isValidRequest = function isValidRequest(request) {
  var hmac = crypto.createHmac('sha1', settings.CLIENT_SECRET);
  hmac.update(request.rawBody);
  var providedSignature = request.headers['x-hub-signature'];
  var calculatedSignature = hmac.digest(encoding='hex');
  return providedSignature != calculatedSignature || !request.body
}

exports.queuePhotos = function queuePhotos(response) {
  var num_updates = response.length;
  var tagName = response.params.tagName;

  request.get({url: settings.apiHost + "tags/" + tagName +
   "/media/recent?client_id=" + settings.CLIENT_ID + "&count=" + num_updates},
   function(err, response, body) {
     if (!error && response.statusCode == 200) {
       urls = getUrlsFrom(response.data);
       attachment_ids = postToGraphite(urls, 'attachments');
       postToGraphite(urls, 'orders', attachment_ids);
     } else {
       console.log("Error retrieving latest photos");
     }
   })
}

function getUrlsFrom(data) {
  var results = [];
  var obj, url;
  for (var i = 0; i<data.length; i++) {
    obj = data[i]
    url = obj.images.standard_resolution.url
    results.push(url);
  }
}

function postToGraphite(urls, type, att) {
  var params;
  if (type == 'attachments') {
    var ids = [];
    for (var i = 0; i<urls.length; i++) {
      params = {
        storage_url: urls[i]
      }
      setTimeout(function() {
        request.post({url: settings.GPH.POST_URL + 'attachments', form: params},
          function(err, response, body) {
            if (!err && response.statusCode == 200)
              ids.push(response.attachment.id)
          }, 3000)
      });
    }
    return ids;
  } else if (type == 'orders') {
    for (var i = 0; i<urls.length; i++) {
      params = {
        customer_id: settings.GPH.CUSTOMER_ID,
        shipping_address_id: settings.GPH.SHIPPING_ADDRESS_ID,
        order_items: [
          item_id: settings.GPH.ITEM_ID,
          quantity: 1,
          size_id: settings.GPH.SIZE_ID,
          attachment_ids: att[i]
        ]
      }
      setTimeout(function() {
        request.post({url: settings.GPH.POST_URL + 'orders', form: params},
          function(err, response, body) {
            if (!err && response.statusCode == 200)
              console.log('Posted order to Graphite')
            else console.log('Error posting order to Graphite')
        })
      }, 3000);
    }
  }
}

exports.subscribeToTag = function subscribeToTag(tagName) {
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
      console.log(response);
      if (!err && response.statusCode == 200)
        console.log("Subscribed to tag: ", tagName);
      else console.log("Failed to subscribe: ", err);
  });

exports.unsubAll = function unsubAll() {
  request.del({url: settings.apiHost + "subscriptions?client_secret=" +
  settings.CLIENT_SECRET + "&client_id=" + settings.CLIENT_ID + "&object=all"},
    function(err, response, body) {
      if (!err && response.statusCode == 200)
        console.log("Unsubscribed to all");
      else console.log("Failed to unsubscribe: ", err);
    });
  }
}
