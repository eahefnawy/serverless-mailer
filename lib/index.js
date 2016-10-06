'use strict';

const path = require('path');
const BbPromise = require('bluebird');
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;

class Mailer {
  constructor(event) {
    this.emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    this.templatesDir = './templates/';

    this.emailService = process.env.EMAIL_SERVICE;
    this.emailServiceUser = process.env.EMAIL_SERVICE_USER;
    this.emailServicePass = process.env.EMAIL_SERVICE_PASS;

    if (!this.emailService) return BbPromise.reject('EMAIL_SERVICE env var not set');
    if (!this.emailServiceUser) return BbPromise.reject('EMAIL_SERVICE_USER env var not set');
    if (!this.emailServicePass) return BbPromise.reject('EMAIL_SERVICE_PASS env var not set');
    if (!this.emailRegex.test(event.from) || !this.emailRegex.test(event.to)) return BbPromise.reject('Please provide valid email addresses.');

    this.event = event;
  }

  render() {
    var templateDirPath = path.join(__dirname, this.templatesDir, this.event.template);
    var template = new EmailTemplate(templateDirPath);
    BbPromise.promisifyAll(template);
    return template.render(event.context); // no Async?!
  }

  send(renderResult) {
    var transporter = nodemailer.createTransport({
      service: this.emailService,
      auth: {
        user: this.emailServiceUser,
        pass: this.emailServicePass,
      }
    });

    BbPromise.promisifyAll(transporter);

    this.event.text = renderResult.text;
    this.event.html = renderResult.html;

    return transporter.sendMailAsync(event)
      .then(function(info){
        console.log('Message sent: ' + info.response);
        return BbPromise.resolve(info.response);
      });

  }
}

module.exports = Mailer;