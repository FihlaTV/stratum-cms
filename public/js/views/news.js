(function(){
	// var $news = $('post');
	var $news = $('.news-list');
	$news.imagesLoaded( function() {
		$news.masonry({ itemSelector: '.news-list-item' });
	});

	// $news.masonry();
}());
