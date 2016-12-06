import React, { Component } from 'react';
import { Link } from 'react-router';
import { Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getNewsArticle, getNews, clearNewsArticle } from '../actions/news';
import moment from 'moment';
import 'moment/locale/sv';

class NewsWidget extends Component {
	constructor (props) {
		super(props);
	}
	componentDidMount () {
		if (this.props.slug) {
			this.props.getNewsArticle(this.props.slug, '?w=150&h=185');
		} else {
			this.props.getNews();
		}
	}
	componentWillUnmount () {
		this.props.clearNewsArticle();
	}
	newsArticle () {
		const article = this.props.news.newsArticle;
		return (
			<div className="news-widget-simple news-widget-portrait">
				<h2>{article.title}</h2>
				<div className="news-widget-portrait-inner">
					<img className="img-portrait" src={article.image.url}/>
					<p>{article.content.lead}</p>
					<Link to={`/react/nyheter/${article.slug}`}>Läs mer.</Link>
				</div>
			</div>
		);
	}
	newsList () {
		return (
			<div className="news-roll-simple">
				<h2>Senaste nytt</h2>
				<ul>
					{this.props.news.articles.slice(0, 3).map(article => (
						<li key={article.title}>
							<span className="news-roll-date">{moment(article.publishedDate).format('L')}</span>
							<Link to={`/react/nyheter/${article.slug}`} className="news-roll-title" onClick={this.props.clearNewsArticle}>{article.title}</Link>
						</li>
					))}
				</ul>
				<Link to="/react/nyheter">Se fler nyheter</Link>
			</div>
		);
	}
	content () {
		return this.props.slug ? this.newsArticle() : this.newsList();
	}
	render () {
		const loading = this.props.slug ? this.props.news.newsArticle.loading : this.props.news.loading;
		return 	loading ? null : <Col md={5}><div className="information-blurb">{this.content()}</div></Col>;
	}
}

const mapStateToProps = ({ news }) => ({ news });

const mapDispatchToProps = (dispatch) => ({
	getNewsArticle: (nyhet, querystring) => dispatch(getNewsArticle(nyhet, querystring)),
	getNews: () => dispatch(getNews()),
	clearNewsArticle: () => dispatch(clearNewsArticle()),
});
export default connect(mapStateToProps, mapDispatchToProps)(NewsWidget);
