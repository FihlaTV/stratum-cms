/* eslint-disable */
(function () {
    imagesLoaded('.news-list', function () {
        new Masonry('.news-list', {
            columnWidth: '.news-list-sizer',
            itemSelector: '.news-list-item',
            percentPosition: true,
            gutter: '.news-list-gutter'
        });
    });
} ());
