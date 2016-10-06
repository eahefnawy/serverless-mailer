'use strict';

require('dotenv').config();

const BbPromise = require('bluebird');
const Mailer = require('../lib');
let mailer;

module.exports.send = (event, context, callback) => {

  return BbPromise.resolve()
    .then(() => {
      mailer = new Mailer(event);
    })
    .then(mailer.render)
    .then(mailer.send)
    .then(response => {
      callback(null, response);
    })
    .catch(e => {
      callback(e);
    });
};