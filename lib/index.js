/* Mailer library */

var Mailer = require('./Mailer.js');

var mod = module.exports = function(opts) {
	return new Mailer(opts);
};

mod.Mailer = Mailer;

/* EOF */
