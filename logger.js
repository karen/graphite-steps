'use strict';

var winston = require('winston');

winston.remove(winston.transports.Console);

winston.add(winston.transports.File, { filename: 'errors.log' });

exports.winston = winston;
