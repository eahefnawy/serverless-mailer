'use strict';

const expect = require('chai').expect;
const event = require('../../event.json');

require('dotenv').config();

const BbPromise = require('bluebird');
const Mailer = require('../');
const mailer = new Mailer(event);

describe('Mailer', function () {
  this.timeout(0);
  it('Integration Test', () => {
    return BbPromise.resolve()
      .bind(mailer)
      .then(mailer.validate)
      .then(mailer.render)
      .then(mailer.send)
      .then(response => {
        console.log(response)
        // callback(null, response);
      })
      .catch(e => {
        console.log(e)
        // callback(e);
      });
  });
});
