var moment = require('moment');
var _ = require('underscore');
var hbs = require('handlebars');
var keystone = require('keystone');
var cloudinary = require('cloudinary');

// Declare Constants
// var CLOUDINARY_HOST = '//res.cloudinary.com';

// Collection of templates to interpolate
var linkTemplate = _.template('<a href="<%= url %>"><%= text %></a>');
var scriptTemplate = _.template('<script src="<%= src %>"></script>');
var cssLinkTemplate = _.template('<link href="<%= href %>" rel="stylesheet">');
// var cloudinaryUrlLimit = _.template(CLOUDINARY_HOST + '/<%= cloudinaryUser %>/image/upload/c_limit,f_auto,h_<%= height %>,w_<%= width %>/<%= publicId %>.jpg');

module.exports = function() {
	var _helpers = {};

	/**
	 * Generic HBS Helpers
	 * ===================
	 */

	// standard hbs equality check, pass in two values from template
	// {{#ifeq keyToCheck data.myKey}} [requires an else blockin template regardless]
	_helpers.ifeq = function(a, b, options) {
		if (a === b) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};

	/**
	 * Port of Ghost helpers to support cross-theming
	 * ==============================================
	 *
	 * Also used in the default keystonejs-hbs theme
	 */

	// ### Date Helper
	// A port of the Ghost Date formatter similar to the keystonejs - jade interface
	//
	//
	// *Usage example:*
	// `{{date format='MM YYYY}}`
	// `{{date publishedDate format='MM YYYY'`
	//
	// Returns a string formatted date
	// By default if no date passed into helper than then a current-timestamp is used
	//
	// Options is the formatting and context check this.publishedDate
	// If it exists then it is formated, otherwise current timestamp returned

	_helpers.date = function(context, options) {
		if (!options && context.hasOwnProperty('hash')) {
			options = context;
			context = undefined;

			if (this.publishedDate) {
				context = this.publishedDate;
			}
		}

		// ensure that context is undefined, not null, as that can cause errors
		context = context === null ? undefined : context;

		var f = options.hash.format || 'MMM Do, YYYY';
		var timeago = options.hash.timeago;
		var locale = options.hash.locale || 'sv';
		var date;

		// set to swedish if nothing else is specified
		moment.locale(locale);

		// if context is undefined and given to moment then current timestamp is given
		// nice if you just want the current year to define in a tmpl
		if (timeago) {
			date = moment(context).fromNow();
		} else {
			date = moment(context).format(f);
		}
		return date;
	};

	// ### Category Helper
	// Ghost uses Tags and Keystone uses Categories
	// Supports same interface, just different name/semantics
	//
	// *Usage example:*
	// `{{categoryList categories separator=' - ' prefix='Filed under '}}`
	//
	// Returns an html-string of the categories on the post.
	// By default, categories are separated by commas.
	// input. categories:['tech', 'js']
	// output. 'Filed Undder <a href="blog/tech">tech</a>, <a href="blog/js">js</a>'

	_helpers.categoryList = function(categories, options) {
		var autolink =
			_.isString(options.hash.autolink) &&
			options.hash.autolink === 'false'
				? false
				: true;
		var separator = _.isString(options.hash.separator)
			? options.hash.separator
			: ', ';
		var prefix = _.isString(options.hash.prefix) ? options.hash.prefix : '';
		var suffix = _.isString(options.hash.suffix) ? options.hash.suffix : '';
		var output = '';

		function createTagList(tags) {
			var tagNames = _.pluck(tags, 'name');

			if (autolink) {
				return _.map(tags, function(tag) {
					return linkTemplate({
						url: '/blog/' + tag.key,
						text: _.escape(tag.name),
					});
				}).join(separator);
			}
			return _.escape(tagNames.join(separator));
		}

		if (categories && categories.length) {
			output = prefix + createTagList(categories) + suffix;
		}
		return new hbs.SafeString(output);
	};

	/* To Implement [Ghost Helpers](http://docs.ghost.org/themes/#helpers)
	 * The [source](https://github.com/TryGhost/Ghost/blob/master/core/server/helpers/index.js)
	 *
	 * * `Foreach` Extended Helper
	 * * `Asset` Helper
	 * * `Content` Helper
	 * * `Excerpt` Helper
	 * * `Has` Helper
	 * * `Encode` Helper
	 * * Pagination
	 * * BodyClass
	 * * PostClass
	 * * meta_title
	 * * meta_description
	 * * ghost_[footer/header]
	 *
	 */

	/**
	 * KeystoneJS specific helpers
	 * ===========================
	 */

	// block rendering for keystone admin css
	_helpers.isAdminEditorCSS = function(user, options) {
		var output = '';
		if (typeof user !== 'undefined' && user.isAdmin) {
			output = cssLinkTemplate({
				href: '/keystone/styles/content/editor.min.css',
			});
		}
		return new hbs.SafeString(output);
	};

	// block rendering for keystone admin js
	_helpers.isAdminEditorJS = function(user, options) {
		var output = '';
		if (typeof user !== 'undefined' && user.isAdmin) {
			output = scriptTemplate({
				src: '/keystone/js/content/editor.js',
			});
		}
		return new hbs.SafeString(output);
	};

	// Used to generate the link for the admin edit post button
	_helpers.adminEditableUrl = function(user, list, options) {
		var rtn = keystone.app.locals.editable(user, {
			list: list,
			id: options,
		});
		return rtn;
	};

	// ### CloudinaryUrl Helper
	// Direct support of the cloudinary.url method from Handlebars (see
	// cloudinary package documentation for more details).
	//
	// *Usage examples:*
	// `{{{cloudinaryUrl image width=640 height=480 crop='fill' gravity='north'}}}`
	// `{{#each images}} {{cloudinaryUrl width=640 height=480}} {{/each}}`
	//
	// Returns an src-string for a cloudinary image

	var cloudinaryHelper = function(cloudinaryFn, context, options) {
		// if we dont pass in a context and just kwargs
		// then `this` refers to our default scope block and kwargs
		// are stored in context.hash
		if (!options && context.hasOwnProperty('hash')) {
			// strategy is to place context kwargs into options
			options = context;
			// bind our default inherited scope into context
			context = this;
		}

		// safe guard to ensure context is never null
		context = context === null ? undefined : context;

		if (context && context.public_id) {
			var imageName = context.public_id;
			options.hash = options.hash || {};
			if (!options.hash.format) {
				imageName = imageName.concat('.', context.format);
			}
			return cloudinaryFn(imageName, options.hash);
		} else {
			return null;
		}
	};
	_helpers.cloudinaryUrl = function(context, options) {
		return cloudinaryHelper(cloudinary.url, context, options);
	};
	_helpers.cloudinaryImage = function(context, options) {
		return cloudinaryHelper(cloudinary.image, context, options);
	};

	// ### News Helpers
	_helpers.newsUrl = function(newsSlug) {
		return '/nyheter/' + newsSlug;
	};

	// ### Content Url Helpers
	// KeystoneJS url handling so that the routes are in one place for easier
	// editing.  Should look at Django/Ghost which has an object layer to access
	// the routes by keynames to reduce the maintenance of changing urls

	// Direct url link to a specific post
	_helpers.postUrl = function(postSlug, options) {
		return '/nyheter/' + postSlug;
	};

	// might be a ghost helper
	// used for pagination urls on blog
	_helpers.pageUrl = function(pageNumber, year, options) {
		return '/nyheter?page=' + pageNumber + (year ? '&year=' + year : '');
	};

	// create the category url for a blog-category page
	_helpers.categoryUrl = function(categorySlug, options) {
		return '/nyheter/' + categorySlug;
	};

	// ### Pagination Helpers
	// These are helpers used in rendering a pagination system for content
	// Mostly generalized and with a small adjust to `_helper.pageUrl` could be universal for content types

	/*
	* expecting the data.posts context or an object literal that has `previous` and `next` properties
	* ifBlock helpers in hbs - http://stackoverflow.com/questions/8554517/handlerbars-js-using-an-helper-function-in-a-if-statement
	* */
	_helpers.ifHasPagination = function(postContext, options) {
		// if implementor fails to scope properly or has an empty data set
		// better to display else block than throw an exception for undefined
		if (_.isUndefined(postContext)) {
			return options.inverse(this);
		}
		if (postContext.next || postContext.previous) {
			return options.fn(this);
		}
		return options.inverse(this);
	};

	_helpers.paginationNavigation = function(
		pages,
		currentPage,
		totalPages,
		year,
		options
	) {
		var html = '';

		// pages should be an array ex.  [1,2,3,4,5,6,7,8,9,10, '....']
		// '...' will be added by keystone if the pages exceed 10
		_.each(pages, function(page, ctr) {
			// create ref to page, so that '...' is displayed as text even though int value is required
			var pageText = page;
			// create boolean flag state if currentPage
			var isActivePage = page === currentPage ? true : false;
			// need an active class indicator
			var liClass = isActivePage ? ' class="active"' : '';

			// if '...' is sent from keystone then we need to override the url
			if (page === '...') {
				// check position of '...' if 0 then return page 1, otherwise use totalPages
				page = ctr ? totalPages : 1;
			}

			// get the pageUrl using the integer value
			var pageUrl = _helpers.pageUrl(page, year);
			// wrapup the html
			html +=
				'<li' +
				liClass +
				'>' +
				linkTemplate({ url: pageUrl, text: pageText }) +
				'</li>\n';
		});
		return html;
	};

	// special helper to ensure that we always have a valid page url set even if
	// the link is disabled, will default to page 1
	_helpers.paginationPreviousUrl = function(previousPage, totalPages, year) {
		if (previousPage === false) {
			previousPage = 1;
		}
		return _helpers.pageUrl(previousPage, year);
	};

	// special helper to ensure that we always have a valid next page url set
	// even if the link is disabled, will default to totalPages
	_helpers.paginationNextUrl = function(nextPage, totalPages, year) {
		if (nextPage === false) {
			nextPage = totalPages;
		}
		return _helpers.pageUrl(nextPage, year);
	};

	//  ### Flash Message Helper
	//  KeystoneJS supports a message interface for information/errors to be passed from server
	//  to the front-end client and rendered in a html-block.  FlashMessage mirrors the Jade-Mixing
	//  for creating the message.  But Part of the logic is in the default.layout.  Decision was to
	//  surface more of the interface in the client html rather than abstracting behind a helper.
	//
	//  @messages:[]
	//
	//  *Usage example:*
	//  `{{#if messages.warning}}
	//      <div class="alert alert-warning">
	//          {{{flashMessages messages.warning}}}
	//      </div>
	//   {{/if}}`

	_helpers.flashMessages = function(messages) {
		var output = '';
		for (var i = 0; i < messages.length; i++) {
			if (messages[i].title) {
				output += '<h4>' + messages[i].title + '</h4>';
			}

			if (messages[i].detail) {
				output += '<p>' + messages[i].detail + '</p>';
			}

			if (messages[i].list) {
				output += '<ul>';
				for (var ctr = 0; ctr < messages[i].list.length; ctr++) {
					output += '<li>' + messages[i].list[ctr] + '</li>';
				}
				output += '</ul>';
			}
		}
		return new hbs.SafeString(output);
	};

	_helpers.shortenString = function(string, length) {
		var output = string + '';
		return new hbs.SafeString(output.substring(0, length || 10));
	};

	_helpers.pluralTitle = function(items, singleTitle, manyTitle) {
		if (items && items.length > 1) {
			return new hbs.SafeString(manyTitle);
		}
		return new hbs.SafeString(singleTitle || '');
	};

	_helpers.getTitle = function(breadcrumbs, inBrand, inSeparator) {
		var separator = arguments.length > 3 ? inSeparator : ' | ';
		var brand = arguments.length > 2 ? inBrand : '';
		var output = _.isEmpty(breadcrumbs) ? '' : _.last(breadcrumbs).label;

		if (!_.isEmpty(brand)) {
			output += _.isEmpty(output) ? brand : separator + brand;
		}
		return new hbs.SafeString(output);
	};

	_helpers.displayMenu = function(pages, subPages, options) {
		if ((pages && pages.length > 1) || (subPages && subPages.length > 0)) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};

	_helpers.ifGreaterThan = function(a, b, options) {
		if (a > b) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};

	return _helpers;
};
