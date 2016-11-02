import React from 'react';
import { Link } from 'react-router';

const NewsListItem = ({ article }) => {
	const date = new Date(article.publishedDate);
	return (
		<div className="news-list-item" >
			<Link to={`/react/nyheter/${article.slug}`}>
				<div className="news-list-item-content">
					<h2>{article.title}</h2>
					<p className="published-at">{`${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`}</p>
					<p className="lead">{article.content.lead}</p>
				</div>
			</Link>
		</div>
	);
};
export default NewsListItem;
