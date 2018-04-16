import React from 'react';
import PropTypes from 'prop-types';
import NewsLink from './NewsLink';
import moment from 'moment';
import 'moment/locale/sv';

const NewsListItem = ({
	slug,
	title,
	publishedDate,
	content = {},
	state = {},
}) => {
	const publishedAt =
		state !== 'draft' ? moment(publishedDate).format('L') : 'Utkast';

	return (
		<div className="news-list-item">
			<NewsLink slug={slug}>
				<div className={`news-list-item-content ${state}`}>
					<h2>{title}</h2>
					<p className="published-at">{publishedAt}</p>
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
