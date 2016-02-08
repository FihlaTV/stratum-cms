var keystone = require('keystone'),
	async = require('async'),
	MenuBlock = keystone.list('MenuBlock');

// Makes sure that there are no null or undefined instances of static in order to make
// dynamic menu items selectable in relationship to pages.

exports = module.exports = function (done) {

	MenuBlock.model
		.find()
		.exists('static', false)
		.exec(function (err, menuBlocks) {
			if (!err) {
				async.each(menuBlocks, function (menuBlock, cb) {
					menuBlock.set('static', false);
					menuBlock.save(cb);
				}, done);
			} else {
				done(err);
			}
		});
};
