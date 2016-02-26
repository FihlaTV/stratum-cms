var keystone = require('keystone');

exports = module.exports = function(req, res) {
	delete req.session.contextId;
	delete req.session.stratumUser;
	res.clearCookie('STRATUMID');
	res.redirect('/');
}