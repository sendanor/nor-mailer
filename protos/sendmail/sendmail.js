/* sendmail -- Prototype sending HTML-based multipart/alternative emails */

var config = JSON.parse(require('fs').readFileSync(__dirname + "/config.json", {'encoding':'utf8'}));

/** Highlight syntax code using pygments */
/*
function highlight_syntax_code_pygments(code, lang, callback) {
	util.debug('Calling pygments()...');
	try {
		var pygments = require('pygments');
		pygments(code, lang, function (err, result) {
			util.debug('End of pygments()...');
			if (err) { return callback(err); }
			callback(null, ''+result);
		});
	} catch(err) {
		return callback(err);
	}
}
*/

/* Hilight syntax code using alexgorbatchev/SyntaxHighlighter */
/*
function highlight_syntax_code_syntaxhiglighter(code, lang, callback) {
	util.debug('Calling highlighter()...');
	try {
		var highlighter = require('SyntaxHighlighter/src/js/shCore.js');
		util.debug( util.inspect(highlighter) );
		
	} catch(err) {
		util.error('Error was ' + err);
		return callback(err);
	}
}
*/

/** The building of an email message */
function build_html_message(data) {
	var Q = require('q');
	var marked = require('marked');

	// Set default options except highlight which has no default
	marked.setOptions({
		gfm: true,
		//highlight: highlight_syntax_code_syntaxhiglighter,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: true,
		smartLists: true,
		smartypants: false,
		langPrefix: 'lang-'
	});
	
	// Using async version of marked
	var defer = Q.defer();
	try {
		util.debug('Calling marked()...');
		marked(''+data, function (err, content) {
			util.debug('End of marked()');
			if (err) {
				defer.reject(err);
			} else {
				defer.resolve(content);
			}
		});
	} catch(err) {
		defer.reject(err);
	}
	return defer.promise;
}

/** The sending of an email message */
function send_mail(opts) {
	var Q = require('q');
	var nodemailer = require("nodemailer");

	var smtpTransport = nodemailer.createTransport("SMTP", config.smtp);
	
	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: opts.from,
		to: opts.to,
		subject: opts.subject,
		text: opts.text,
		html: opts.html
	};
	
	// send mail with defined transport object
	var defer = Q.defer();
	try {
		util.debug('Calling smtpTransport.sendMail()...');
		smtpTransport.sendMail(mailOptions, function(error, response){
			util.debug('End of smtpTransport.sendMail()');
			if(error){
				defer.reject(error);
				return;
			}
			defer.resolve(response);
		});
	} catch(err) {
		defer.reject(err);
	}
	return defer.promise.fin(function() { smtpTransport.close(); });
}

/* Testing the code */
var fs = require('nor-fs');
var util = require('util');
fs.readFile(__dirname + '/templates/hello.md', {'encoding':'utf8'}).then(function(md_data) {
	return build_html_message(''+md_data).then(function(html_data) {

		util.debug( 'HTML is:\n----\n' + html_data + '\n--end--\n');

		/*
		return send_mail({
			from: "JHH <jhh@atlas.sendanor.fi>",
			to: "jhh@sendanor.com",
			subject: "Test HTML email",
			text: ''+md_data,
			html: ''+html_data
		});
		*/
	});
}).then(function() {
	util.debug('Email sent successfully.');
}).fail(function(err) {
	require('prettified').errors.print(err);
}).done();

/* EOF */
