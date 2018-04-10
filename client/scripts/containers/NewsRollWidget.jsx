import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchNewsItemsIfNeeded } from '../actions/news';
import NewsLink from '../components/NewsLink';
import Spinner from '../components/Spinner';
import moment from 'moment';
import 'moment/locale/sv';

class NewsRollWidget extends Component {
	componentDidMount() {
		this.props.fetchNewsItemsIfNeeded();
	}
	render() {
		const { title, maxItems, items, loading } = this.props;
		return loading ? (
			<Spinner />
		) : (
			<div className="information-blurb">
				<div className="news-roll-simple">
					<h2>{title}</h2>
					<ul>
						{items
							.slice(0, maxItems)
							.map(({ title, publishedDate, slug }) => (
								<li key={slug}>
									<span className="news-roll-date">
										{moment(publishedDate).format('L')}
									</span>
									<NewsLink
										slug={slug}
										className="news-roll-title"
									>
										{title}
									</NewsLink>
								</li>
							))}
					</ul>
					<NewsLink>Se fler nyheter.</NewsLink>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ news }) => ({
	items: news.items,
	loading: news.loading,
});

const mapDispatchToProps = dispatch => ({
	fetchNewsItemsIfNeeded: () => dispatch(fetchNewsItemsIfNeeded()),
});

NewsRollWidget.defaultProps = {
	title: 'Senaste Nytt',
	maxItems: 3,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsRollWidget);
