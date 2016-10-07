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
  // describe('#constructor()', () => {
  //   it('should attach serverless instance', () => {
  //     const configInstance = new Config(serverless);
  //     expect(typeof configInstance.serverless.version).to.be.equal('string');
  //   });
  //
  //   it('should add config if provided', () => {
  //     const configInstance = new Config(serverless, { servicePath: 'string' });
  //     expect(configInstance.servicePath).to.be.equal('string');
  //   });
  // });
  //
  // describe('#update()', () => {
  //   it('should update config', () => {
  //     const configInstance = new Config(serverless, { servicePath: 'config1' });
  //     expect(configInstance.servicePath).to.be.equal('config1');
  //
  //     configInstance.update({ servicePath: 'config2' });
  //     expect(configInstance.servicePath).to.be.equal('config2');
  //   });
  // });
});
