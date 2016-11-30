import moment from 'moment';
import 'moment/locale/sv';
import React from 'react';
import { Link } from 'react-router';

const NewsListItem = ({ article, setBreadcrumbs }) => {
	return (
		<div className="news-list-item" >
			<Link to={`/react/nyheter/${article.slug}`} onClick={() => setBreadcrumbs([{ url: 'nyheter/', label: 'Nyheter' }, { url: `nyheter/${article.slug}`, label: article.title }])} >
				<div className="news-list-item-content">
					<h2>{article.title}</h2>
					<p className="published-at">{moment(article.publishedDate).format('L')}</p>
					<p className="lead">{article.content.lead}</p>
				</div>
			</Link>
		</div>
	);
};
export default NewsListItem;
