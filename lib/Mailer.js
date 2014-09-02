/* sendmail -- Prototype sending HTML-based multipart/alternative emails */

var Q = require('q');
var extend = require('nor-extend');
var nodemailer = require("nodemailer");

var _marked = require('marked');

_marked.setOptions({
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

var build_html_body = Q.denodeify(_marked);

/** The sending of an email message */
function Mailer(opts) {
	opts = opts || {};
	var smtp = opts.smtp;
	if(!smtp) { throw new TypeError("bad arguments"); }
	this._transport = nodemailer.createTransport("SMTP", smtp);
	this._transport_sendMail = Q.nbind(this._transport.sendMail, this._transport);
	this._transport_close = Q.nbind(this._transport.close, this._transport);
}

/** Send email */
Mailer.prototype._send = function(opts) {
	opts = opts || {};
	var mailOptions = {
		from: opts.from,
		to: opts.to,
		subject: opts.subject,
		text: opts.text,
		html: opts.html
	};
	return this._transport_sendMail(mailOptions);
};

/** Close mailer */
Mailer.prototype._close = function() {
	return this._transport.close();
};

/** Close mailer */
Mailer.prototype.close = function() {
	return extend.promise( [Mailer], this._close() );
};

/** Send email */
Mailer.prototype.send = function(opts) {
	var self = this;
	opts = opts || {};
	if(!(opts.body && opts.from && opts.to)) { throw new TypeError("bad arguments"); }

	// FIXME: Get default subject from markdown

	var send_opts = {
		from: opts.from,
		to: opts.to,
		subject: ''+(opts.subject || 'No subject'),
		text: ''+(opts.body)
	};

	var p = build_html_body(''+opts.body).then(function(html_body) {
		send_opts.html = ''+html_body;
		return self._send(send_opts);
	});

	return extend.promise( [Mailer], p);
};

// Exports
module.exports = Mailer;

/* EOF */
