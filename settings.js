'use strict';

var express = require('express');

var app = express();

exports.app = app;

exports.host = 'ec2-54-169-208-170.ap-southeast-1.compute.amazonaws.com';
exports.port = process.env.IG_APP_PORT || 3000;
exports.CLIENT_ID = process.env.IG_CLIENT_ID || 'CLIENT-ID';
exports.CLIENT_SECRET = process.env.IG_CLIENT_SECRET || 'CLIENT-SECRET';
exports.httpClient = (process.env.IG_USE_INSECURE ? require('http') : require('https'));
exports.apiHost = process.env.IG_API_HOST || 'https://api.instagram.com/v1/';
exports.apiPort = process.env.IG_API_PORT || null;
exports.basePath = process.env.IG_BASE_PATH || '';

exports.igLimit = 1;
exports.igTag = 'graphitesteps';

exports.appSub = true;

exports.GPH = {
  DASHBOARD: 'http://jxstage.kiangtengl.me/admin/orders/',
  POST_URL: 'http://jxstage.kiangtengl.me/api/v1/',
  AUTH_TOKEN: 'YOUR_AUTH_TOKEN',
  SHIPPING_ADDRESS: {
    address_line_1: 'Kent Ridge',
    city: 'Singapore',
    state: 'Singapore',
    zip: '123456',
    country: 'Singapore'
  },
  COMBINATION_ID: '1'
};
