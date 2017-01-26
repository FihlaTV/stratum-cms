import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getNews } from '../actions/news';
import NewsLink from '../components/NewsLink';
import moment from 'moment';
import 'moment/locale/sv';

const NewsRollWidget = ({ title, maxItems, items, loading, getNews }) => {
	if (loading) {
		getNews();
	}
	return loading ? null : (
		<div className="information-blurb">
			<div className="news-roll-simple">
				<h2>{title}</h2>
				<ul>
					{items.slice(0, maxItems).map(({ title, publishedDate, slug }) => (
						<li key={slug}>
							<span className="news-roll-date">{moment(publishedDate).format('L')}</span>
							<NewsLink slug={slug} className="news-roll-title">{title}</NewsLink>
						</li>
					))}
				</ul>
				<Link to="/react/nyheter">Se fler nyheter.</Link>
			</div>
		</div>
	);
};

const mapStateToProps = ({ news }) => ({ items: news.items, loading: news.loading });

const mapDispatchToProps = (dispatch) => ({
	getNews: () => dispatch(getNews()),
});

NewsRollWidget.defaultProps = {
	title: 'Senaste Nytt',
	maxItems: 3,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsRollWidget);
