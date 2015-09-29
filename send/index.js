'use strict';

var path          = require('path'),
    Promise       = require('bluebird'),
    nodemailer    = require('nodemailer'),
    EmailTemplate = require('email-templates').EmailTemplate;

// Export For Lambda Handler
module.exports.run = function(event, context, cb) {

  if (!process.env.EMAIL_SERVICE) {
    return cb(new Error('EMAIL_SERVICE env var not set'));
  }

  if (!process.env.EMAIL_SERVICE_USER) {
    return cb(new Error('EMAIL_SERVICE_USER env var not set'));
  }

  if (!process.env.EMAIL_SERVICE_PASS) {
    return cb(new Error('EMAIL_SERVICE_PASS env var not set'));
  }

  var templateDir = path.join(__dirname, 'templates', event.template);
  var template = new EmailTemplate(templateDir);

  Promise.promisifyAll(template);

  template.render(event.context)
    .then(function(result) {
      var transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_SERVICE_USER,
          pass: process.env.EMAIL_SERVICE_PASS
        }
      });
      
      var event.text = result.text;
      var event.html = result.html;
      
      transporter.sendMail(event);
      
      return cb(null, {message: 'Yaay success'});
    })
    .catch(function(e) {
      return cb(new Error('Something went wrong!'));
    });
};
