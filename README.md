nor-mailer
==========

Asynchronous HTML email sending with Markdown formating.

This library is in an early development state and the API might change any time.

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
}).then(function() {
	console.log('Email sent successfully.');
}).fail(function(err) {
	console.error('Error: ' + err);
}).done();

```
