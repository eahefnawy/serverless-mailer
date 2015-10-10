'use strict';

var path          = require('path'),
    Promise       = require('bluebird'),
    nodemailer    = require('nodemailer'),
    EmailTemplate = require('email-templates').EmailTemplate;

var TEMPLATES_DIR = '../../../aws_modules/awsm-mailer/mailer/templates/';
var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

module.exports.send = function(event) {
  if (!process.env.EMAIL_SERVICE) {
    throw new Error('EMAIL_SERVICE env var not set');
  }

  if (!process.env.EMAIL_SERVICE_USER) {
    throw new Error('EMAIL_SERVICE_USER env var not set');
  }

  if (!process.env.EMAIL_SERVICE_PASS) {
    throw new Error('EMAIL_SERVICE_PASS env var not set');
  }

  if (!emailRegex.test(event.from) || !emailRegex.test(event.to)) {
    throw new Error('Please provide valid email addresses.');
  }

  var templateDir = path.join(__dirname, TEMPLATES_DIR, event.template);
  var template = new EmailTemplate(templateDir);

  Promise.promisifyAll(template);

  var sendMail = function(result) {
    var transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS
      }
    });

    Promise.promisifyAll(transporter);

    event.text = result.text;
    event.html = result.html;

    return transporter.sendMailAsync(event);
  };

  return template.render(event.context).then(sendMail);
};
