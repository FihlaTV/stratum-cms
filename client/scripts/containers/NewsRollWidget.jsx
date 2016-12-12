import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getNews } from '../actions/news';
import moment from 'moment';
import 'moment/locale/sv';

const NewsRollWidget = (props) => {
	if (props.news.loading) props.getNews();
	return props.news.loading ? null : (
		<div className="information-blurb">
			<div className="news-roll-simple">
				<h2>Senaste nytt</h2>
				<ul>
					{props.news.articles.slice(0, 3).map(article => (
						<li key={article.title}>
							<span className="news-roll-date">{moment(article.publishedDate).format('L')}</span>
							<Link to={`/react/nyheter/${article.slug}`} className="news-roll-title" onClick={props.clearNewsArticle}>{article.title}</Link>
						</li>
					))}
				</ul>
				<Link to="/react/nyheter">Se fler nyheter</Link>
			</div>
		</div>
	);
};

const mapStateToProps = ({ news }) => ({ news });

const mapDispatchToProps = (dispatch) => ({
	getNews: () => dispatch(getNews()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsRollWidget);
