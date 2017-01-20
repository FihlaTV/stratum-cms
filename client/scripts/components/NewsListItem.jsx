import React, { PropTypes } from 'react';
import NewsLink from './NewsLink';
import moment from 'moment';
import 'moment/locale/sv';

const NewsListItem = ({ slug, title, publishedDate, content = {} }) => {
	return (
		<div className="news-list-item" >
			<NewsLink
				slug={slug}
			>
				<div className="news-list-item-content">
					<h2>{title}</h2>
					<p className="published-at">{moment(publishedDate).format('L')}</p>
					<p className="lead">{content.lead}</p>
				</div>
			</NewsLink>
		</div>
	);
};

NewsListItem.propTypes = {
	content: PropTypes.shape({
		lead: PropTypes.string,
	}),
	publishedDate: PropTypes.string,
	slug: PropTypes.string,
	title: PropTypes.string,
};

export default NewsListItem;
