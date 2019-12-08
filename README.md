***DEPRECATED:*** This library has moved to [@norjs/mailer](https://github.com/norjs/mailer) (with some API changes).

nor-mailer
==========

Asynchronous HTML email sending with Markdown formating.

**Warning!** This library is in an early development state and the API might change any time.

We are using:

* [nodemailer](https://github.com/andris9/Nodemailer#nodemailer) for actual email sending
* [marked](https://github.com/chjj/marked) for Markdown to HTML conversion
* [q](https://github.com/kriskowal/q) for promises
* [nor-extend](https://github.com/sendanor/nor-extend) for making Q promises chainable

mailer.send(opts)
-----------------

Sends HTML formated email with markdown text alternative.

```javascript
var smtp_config = {
	"host": "smtp.example.com",
	"port": 465,
	"secureConnection": true,
	"auth": {
		"user": "app",
           "pass": "12345678"
	}
};

var mailer = require('nor-mailer')({"smtp": smtp_config});

var body = 'The subject of the message\n'+
	'--------------------------\n'+
	'\n'+
	'This is a *sample* email made with Markdown.\n'+
	'\n'+
	'| Tables | Are | Cool |\n'+
	'| ------ | --- | ---- |\n'+
	'| col 3 is      | right-aligned | $1600 |\n'+
	'| col 2 is      | centered      |   $12 |\n'+
	'| zebra stripes | are neat      |    $1 |\n';

mailer.send({
	from:'app@example.com', 
	to:'jhh@example.com',
	subject:'Example message',
	body: body
}).close().then(function() {
	console.log('Email sent successfully.');
}).fail(function(err) {
	console.error('Error: ' + err);
}).done();

```

Commercial Support
------------------

You can buy commercial support from [Sendanor](http://sendanor.com/software).
