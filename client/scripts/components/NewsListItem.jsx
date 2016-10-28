import React from 'react';

const NewsListItem = ({ article }) => {
	const date = new Date(article.publishedDate);
	return (
		<div className="news-list-item" key={article.title}>
			<a href={`/nyheter/${article.title}`}>
				<div className="news-list-item-content">
					<h2>{article.title}</h2>
					<p className="published-at">{`${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`}</p>
					<p className="lead">{article.content.lead}</p>
				</div>
			</a>
		</div>
	);
};
export default NewsListItem;
