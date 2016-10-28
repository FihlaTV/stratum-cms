var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * NewsItem Model
 * ==========
 */

var NewsItem = new keystone.List('NewsItem', {
	map: { name: 'title' },
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	autokey: { path: 'slug', from: 'title', unique: true },
	plural: 'News',
	defaultSort: '-publishedDate',
});

NewsItem.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true, collapse: true },
	publishedDate: {
		type: Types.Date,
		index: true,
		dependsOn: { state: 'published' },
		note: 'News items without a published date will not be displayed in the news listing.\n\n'
			+ 'If the date is in the future, the news item will appear at the following date.',
	},
	subtitle: { type: String, hidden: true }, // Hide this for future use
	image: { type: Types.CloudinaryImage, autoCleanup: true },
	imageDescription: {
		collapse: true,
		type: String,
	},
	imageLayout: {
		type: Types.Select,
		options: 'portrait, landscape',
		default: 'portrait',
		emptyOption: false,
		note: 'Determines the position and layout of the news item\'s image. Portrait places is to the right of the text and Landscape above the text',
	},
	content: {
		lead: { type: Types.Textarea, height: 150, note: 'Introduction to the news item. Keep this below ~300 characters' },
		extended: { type: Types.Markdown, height: 400, toolbarOptions: { hiddenButtons: 'Image,Code' } },
	},
	resources: {
		type: Types.Relationship,
		ref: 'Resource',
		many: true,
		collapse: true,
	},
});

/**
 * Bug in keystone currently prevents error messages to be displayed
 * so this is commented out for now.
 */
// NewsItem.schema.path('content.lead').validate(function(value){
// 	return !value || value.length <= 300;
// }, 'Your text cannot be longer than 300 characters. Please try to shorten your text');

NewsItem.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
NewsItem.register();

/* var News = keystone.list('NewsItem').model;

Array.apply(null, { length: 5200 }).map(function (item, index) {
var news = new News({
createdAt: "2016-10-26T11:09:16.872Z",
title: "Bacon ipsum" + index,
publishedDate: "2016-10-25T22:00:00.000Z",
resources: [ ],
content: {
lead: "Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!" + index,
extended: {
	html: "<p>Bacon ipsum dolor amet ground round ham pork loin brisket. Prosciutto tri-tip rump, meatball pork belly ham hock ribeye ball tip biltong andouille picanha pork alcatra. Shank biltong spare ribs pork chop chuck beef ribs cow ham hock. Prosciutto brisket short ribs tri-tip bresaola, pastrami tongue leberkas ball tip pig venison kielbasa bacon shank jowl.</p> <p>Kielbasa pig meatloaf, shoulder bresaola capicola salami beef ribs meatball rump. Chicken tail venison beef ribs, turducken fatback prosciutto pastrami cupim. Ball tip short loin spare ribs swine. Venison brisket corned beef tongue drumstick bresaola, salami short loin burgdoggen.</p> <p>Ground round alcatra boudin ham meatloaf leberkas spare ribs porchetta flank turkey venison pork loin strip steak cow. Prosciutto rump strip steak hamburger sirloin kielbasa corned beef pastrami fatback. Sirloin chicken filet mignon, fatback flank biltong bresaola tail t-bone short loin ground round beef rump ham leberkas. Shankle sausage turducken leberkas brisket. Pastrami short ribs pancetta, flank pork chop capicola strip steak filet mignon jowl ribeye. Landjaeger ground round tongue, leberkas venison cupim alcatra biltong.</p> <p>Sirloin pork chop tongue boudin jowl, pancetta corned beef brisket kevin fatback pork belly venison prosciutto. Ground round beef ribs corned beef brisket fatback short ribs ribeye filet mignon picanha jerky tail. Ground round pork chop t-bone alcatra landjaeger turkey sausage salami meatloaf fatback. Frankfurter drumstick hamburger brisket cow. Ribeye salami pastrami t-bone. Picanha pork alcatra pastrami prosciutto strip steak meatball shoulder burgdoggen hamburger bacon bresaola kevin beef sirloin.</p> <p>Boudin meatloaf ham pancetta ball tip landjaeger turducken fatback andouille. Pork loin biltong pig porchetta, capicola cupim tongue. Picanha meatball porchetta beef ribs pork flank ham tongue. Prosciutto bresaola venison, fatback chuck capicola kielbasa filet mignon picanha leberkas.</p> <p>Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!</p> ",
	md: "Bacon ipsum dolor amet ground round ham pork loin brisket. Prosciutto tri-tip rump, meatball pork belly ham hock ribeye ball tip biltong andouille picanha pork alcatra. Shank biltong spare ribs pork chop chuck beef ribs cow ham hock. Prosciutto brisket short ribs tri-tip bresaola, pastrami tongue leberkas ball tip pig venison kielbasa bacon shank jowl. Kielbasa pig meatloaf, shoulder bresaola capicola salami beef ribs meatball rump. Chicken tail venison beef ribs, turducken fatback prosciutto pastrami cupim. Ball tip short loin spare ribs swine. Venison brisket corned beef tongue drumstick bresaola, salami short loin burgdoggen. Ground round alcatra boudin ham meatloaf leberkas spare ribs porchetta flank turkey venison pork loin strip steak cow. Prosciutto rump strip steak hamburger sirloin kielbasa corned beef pastrami fatback. Sirloin chicken filet mignon, fatback flank biltong bresaola tail t-bone short loin ground round beef rump ham leberkas. Shankle sausage turducken leberkas brisket. Pastrami short ribs pancetta, flank pork chop capicola strip steak filet mignon jowl ribeye. Landjaeger ground round tongue, leberkas venison cupim alcatra biltong. Sirloin pork chop tongue boudin jowl, pancetta corned beef brisket kevin fatback pork belly venison prosciutto. Ground round beef ribs corned beef brisket fatback short ribs ribeye filet mignon picanha jerky tail. Ground round pork chop t-bone alcatra landjaeger turkey sausage salami meatloaf fatback. Frankfurter drumstick hamburger brisket cow. Ribeye salami pastrami t-bone. Picanha pork alcatra pastrami prosciutto strip steak meatball shoulder burgdoggen hamburger bacon bresaola kevin beef sirloin. Boudin meatloaf ham pancetta ball tip landjaeger turducken fatback andouille. Pork loin biltong pig porchetta, capicola cupim tongue. Picanha meatball porchetta beef ribs pork flank ham tongue. Prosciutto bresaola venison, fatback chuck capicola kielbasa filet mignon picanha leberkas. Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!"
}
},
imageLayout: "portrait",
state: "published"
})
news.save(function (err) {
    if (err) {
        // handle error
        return console.log(err);
    }

    // user has been saved
    console.log(user);
})
})
*/
