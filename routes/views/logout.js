exports = module.exports = function (req, res) {
	delete req.session.context;
	// This should be handled through stratum logout instead
	// res.clearCookie('STRATUMID');
	res.redirect('/');
};
