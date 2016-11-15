import React from 'react';
import { Link } from 'react-router';

const NewsListItem = ({ article }) => {
	const date = new Date(article.publishedDate);
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth() + 1;
	const formatedMonth = month < 10 ? '0' + month : month;
	const day = date.getDate();
	const formatedDay = day < 10 ? '0' + day : day;
	return (
		<div className="news-list-item" >
			<Link to={`/react/nyheter/${article.slug}`} >
				<div className="news-list-item-content">
					<h2>{article.title}</h2>
					<p className="published-at">{`${year}-${formatedMonth}-${formatedDay}`}</p>
					<p className="lead">{article.content.lead}</p>
				</div>
			</Link>
		</div>
	);
};
export default NewsListItem;
