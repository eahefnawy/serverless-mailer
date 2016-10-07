# ✉️ serverless-mailer
Serverless Service for sending emails. Compatible with Serverless version `1.0.0-rc.2`.

### Features

* 30+ pre-configured services (Gmail, Hotmail, SendGrid...etc)
* HTML content as well as plain text alternative
* 30+ supported HTML template engines (handlebars, jade, haml...etc)
* Easy HTML styling with Juice
* Embedded images in HTML
* Email Attachments
* Unicode to use any characters

### Quick Usage
- Clone the service

```
git clone https://github.com/eahefnawy/serverless-mailer
```

- Install Dependencies

```
cd serverless-mailer
npm install
```

- Set Environment Variables

Open `.env` file and set the following env vars:

```
EMAIL_SERVICE=Gmail
EMAIL_SERVICE_USER=username@gmail.com
EMAIL_SERVICE_PASS=password
```
**NOTE:** In case of Gmail, you need to setup an "App Password"

- Deploy The Service (`serverless deploy`)
- Invoke The Function:

Edit the following event data in the `event.json` file with your own data:

```
{
  "from": "username@gmail.com",
  "to": "receiver@address.com",
  "subject": "Hello",
  "template": "welcome",
  "context": {
    "first_name": "Sam",
    "last_name": "Smith"
  }
}

```

Then invoke the `send` function by running `serverless invoke -f send -e event.json`

This will use the `welcome` template coupled with the context/data (first_name & last_name).
You should receive an email that says:

```
Welcome Sam Smith
```

You can edit the template text by editing these two files:

```
serverless-mailer/lib/templates/html.handlebars
serverless-mailer/lib/templates/text.handlebars
```

### Supported Services
serverless-mailer supports the following 30 service, pre-configured and ready to use. You just provide the service, username & password in env vars as shown earlier:

* **'1und1'**
* **'AOL'**
* **'DebugMail.io'**
* **'DynectEmail'**
* **'FastMail'**
* **'GandiMail'**
* **'Gmail'**
* **'Godaddy'**
* **'GodaddyAsia'**
* **'GodaddyEurope'**
* **'hot.ee'**
* **'Hotmail'**
* **'iCloud'**
* **'mail.ee'**
* **'Mail.ru'**
* **'Mailgun'**
* **'Mailjet'**
* **'Mandrill'**
* **'Naver'**
* **'Postmark'**
* **'QQ'**
* **'QQex'**
* **'SendCloud'**
* **'SendGrid'**
* **'SES'**
* **'Sparkpost'**
* **'Yahoo'**
* **'Yandex'**
* **'Zoho'**

### Template Engines
serverless-mailer comes with a `welcome` template for demonstration. You can add/remove templates from the following directory:

```
serverless-mailer/lib/templates/
```

serverless-mailer uses handlebars as the default template engine. You can use any other template engine by adding it to the module's `package.json` file and update dependencies with `npm install`.

Here's the full list of supported templates:

- [atpl](https://github.com/soywiz/atpl.js)
- [doT.js](https://github.com/olado/doT) [(website)](http://olado.github.io/doT/)
- [dust (unmaintained)](https://github.com/akdubya/dustjs) [(website)](http://akdubya.github.com/dustjs/)
- [dustjs-linkedin (maintained fork of dust)](https://github.com/linkedin/dustjs) [(website)](http://linkedin.github.io/dustjs/)
- [eco](https://github.com/sstephenson/eco)
- [ect](https://github.com/baryshev/ect) [(website)](http://ectjs.com/)
- [ejs](https://github.com/visionmedia/ejs)
- [haml](https://github.com/visionmedia/haml.js) [(website)](http://haml-lang.com/)
- [haml-coffee](https://github.com/9elements/haml-coffee) [(website)](http://haml-lang.com/)
- [hamlet](https://github.com/gregwebs/hamlet.js)
- [handlebars](https://github.com/wycats/handlebars.js/) [(website)](http://handlebarsjs.com/)
- [hogan](https://github.com/twitter/hogan.js) [(website)](http://twitter.github.com/hogan.js/)
- [htmling](https://github.com/codemix/htmling)
- [jade](https://github.com/visionmedia/jade) [(website)](http://jade-lang.com/)
- [jazz](https://github.com/shinetech/jazz)
- [jqtpl](https://github.com/kof/node-jqtpl) [(website)](http://api.jquery.com/category/plugins/templates/)
- [JUST](https://github.com/baryshev/just)
- [liquor](https://github.com/chjj/liquor)
- [lodash](https://github.com/bestiejs/lodash) [(website)](http://lodash.com/)
- [mote](https://github.com/satchmorun/mote) [(website)](http://satchmorun.github.io/mote/)
- [mustache](https://github.com/janl/mustache.js)
- [nunjucks](https://github.com/mozilla/nunjucks) [(website)](https://mozilla.github.io/nunjucks)
- [QEJS](https://github.com/jepso/QEJS)
- [ractive](https://github.com/Rich-Harris/Ractive)
- [react](https://github.com/facebook/react)
- [swig](https://github.com/paularmstrong/swig) [(website)](http://paularmstrong.github.com/swig/)
- [templayed](http://archan937.github.com/templayed.js/)
- [liquid](https://github.com/leizongmin/tinyliquid) [(website)](http://liquidmarkup.org/)
- [toffee](https://github.com/malgorithms/toffee)
- [underscore](https://github.com/documentcloud/underscore) [(website)](http://documentcloud.github.com/underscore/)
- [walrus](https://github.com/jeremyruppel/walrus) [(website)](http://documentup.com/jeremyruppel/walrus/)
- [whiskers](https://github.com/gsf/whiskers.js)

after choosing your template engine, make sure the file extensions of the template files match the template you chose:

```
html.{{ext}}
text.{{ext}}
style.{{ext}}
```

### Mail Options (Event Properties):

Here's the full list of options you can pass in your event:

  - **from** - The e-mail address of the sender. All e-mail addresses can be plain `'sender@server.com'` or formatted `'Sender Name <sender@server.com>'`, see [here](#address-formatting) for details
  - **sender** - An e-mail address that will appear on the *Sender:* field
  - **to** - Comma separated list or an array of recipients e-mail addresses that will appear on the *To:* field
  - **cc** - Comma separated list or an array of recipients e-mail addresses that will appear on the *Cc:* field
  - **bcc** - Comma separated list or an array of recipients e-mail addresses that will appear on the *Bcc:* field
  - **replyTo** - An e-mail address that will appear on the *Reply-To:* field
  - **inReplyTo** - The message-id this message is replying
  - **references** - Message-id list (an array or space separated string)
  - **subject** - The subject of the e-mail
  - **template** - The template to use for this email. Make sure it matches one of the folder names inside the `templates` folder
  - **context** - The context/data the template needs. eg. `{"first_name": "..."}`
  - **watchHtml** - Apple Watch specific HTML version of the message (*experimental*)
  - **headers** - An object or array of additional header fields (e.g. *{"X-Key-Name": "key value"}* or *[{key: "X-Key-Name", value: "val1"}, {key: "X-Key-Name", value: "val2"}]*)
  - **attachments** - An array of attachment objects
  - **alternatives** - An array of alternative text contents (in addition to text and html parts)
  - **envelope** - optional SMTP envelope, if auto generated envelope is not suitable
  - **messageId** - optional Message-Id value, random value will be generated if not set
  - **date** - optional Date value, current UTC string will be used if not set
  - **encoding** - optional transfer encoding for the textual parts
