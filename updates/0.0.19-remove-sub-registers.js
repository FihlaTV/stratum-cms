var keystone = require('keystone'),
	async = require('async'),
	RegisterInformation = keystone.list('RegisterInformation');

/**
 * Removes all sub register and portal references to RegisterInformation
 */
exports = module.exports = function (done) {
	var context = {
		RegisterInformations: []
	};

	async.series({
		getRegisterInformation: function (next) {
			RegisterInformation.model
				.find()
				.exec(function (err, ri) {
					if (!err) {
						context.ri = ri;
					}
					next(err);
				});
		},
		removePortalRefs: function (next) {
			async.forEach(context.ri, function (ri, cb) {
				if(ri.get('subRegisters')){
					ri.set('subRegisters', undefined, { strict: false });
				}
				if(ri.get('isPortal')){
					ri.set('isPortal', undefined, { strict: false });
				}
				ri.save(cb);
			}, next);
		}
	}, done);
};
