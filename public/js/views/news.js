(function() {
	// var $news = $('post');
	var $news = $('.news-list');
	$news.imagesLoaded(function() {
		$news.masonry({
			columnWidth: '.news-list-sizer',
			itemSelector: '.news-list-item',
			percentPosition: true,
			gutter: '.news-list-gutter'
		});
	});

	// $news.masonry();
}());
