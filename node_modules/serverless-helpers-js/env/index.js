'use strict';

/**
 * Find closest .env file. Need to do this because .env is not always at root of project (like during local testing)
 */

var path = require('path'),
    fs   = require('fs');

function fileExistsSync(path) {
  try {
    var stats = fs.lstatSync(path);
    return stats.isFile();
  }
  catch (e) {
    return false;
  }
}

var dirName = eval('__dirname'),
    i       = 0;

while (i < 6) {
  if (fileExistsSync(path.join(dirName, '.env'))) {
    break;
  }

  dirName = path.join(dirName, '..');
  ++i;
}

require('dotenv').config({path: path.join(dirName, '.env'), silent: true});