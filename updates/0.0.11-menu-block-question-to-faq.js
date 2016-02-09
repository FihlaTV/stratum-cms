var keystone = require('keystone'),
	async = require('async'),
	MenuBlock = keystone.list('MenuBlock');

// Change section name from questions to faq

exports = module.exports = function (done) {

	MenuBlock.model
		.find()
		.where('section', 'questions')
		.exec(function (err, menuBlocks) {
			if (!err) {
				async.each(menuBlocks, function (menuBlock, cb) {
					menuBlock.set('section', 'faq');
					menuBlock.save(cb);
				}, done);
			} else {
				done(err);
			}
		});
};
