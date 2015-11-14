var express = require('express');

var app = express();

exports.app = app;

exports.host = '20f720cf.ngrok.io'
exports.port = process.env.IG_APP_PORT || 3000;
exports.CLIENT_ID = process.env.IG_CLIENT_ID || 'CLIENT-ID';
exports.CLIENT_SECRET = process.env.IG_CLIENT_SECRET || 'CLIENT-SECRET';
exports.httpClient = (process.env.IG_USE_INSECURE ? require('http') : require('https'));
exports.apiHost = process.env.IG_API_HOST || 'https://api.instagram.com/v1/';
exports.apiPort = process.env.IG_API_PORT || null;
exports.basePath = process.env.IG_BASE_PATH || '';

exports.GPH = {
  POST_URL: 'http://jxstage.kiangtengl.me/api/v1/',
  CUSTOMER_ID: process.env.GPH_CUST_ID || 'CUST-ID',
  SHIPPING_ADDRESS_ID: process.env.GPH_SHIP_ID || 'SHIP-ID',
  ITEM_ID: 'ITEM-ID',
  SIZE_ID: 'SIZE-ID'
}
