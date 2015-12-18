var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * NewsItem Model
 * ==========
 */

var NewsItem = new keystone.List('NewsItem', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	plural: 'News',
	defaultSort: '-publishedDate'
});

NewsItem.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	subtitle: { type: String },
	image: { type: Types.CloudinaryImage },
	newsType: { type: Types.Select,
				default: 'brief',
				required: true,
				note: 'Select which type of news this contains' + 
				'\n- **Brief**: Only a few lines' +
				'\n- **Extended**: Longer news article with possibility of writing a lead and extended text',
				emptyOption: false,
				options: [{
					value: 'brief',
					label: 'Brief'
				}, {
					value: 'extended',
					label: 'Extended'
				}]},
	content: {
		brief: { type: Types.Textarea, height: 150, note: 'Briefly summarize the news item in a few lines. Used to present outside context' },
		lead: { type: Types.Textarea, height: 150, dependsOn: { newsType: 'extended' } },
		extended: { type: Types.Markdown, height: 400, dependsOn: { newsType: 'extended' }, toolbarOptions: { hiddenButtons: 'Image,Quote,Code' } }
	}
	// categories: { type: Types.Relationship, ref: 'NewsItemCategory', many: true }
});

NewsItem.schema.virtual('content.full').get(function() {
	return this.get('content.extended.html') || this.content.brief;
});

NewsItem.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
NewsItem.register();
