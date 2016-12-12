import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getNewsArticle, getNews, clearNewsArticle } from '../actions/news';

class NewsItemWidget extends Component {
	constructor (props) {
		super(props);
	}
	componentDidMount () {
		let imageSize;
		if (this.props.layout === 'smallImage') {
			imageSize = { w: 150, h: 185 };
		} else if (this.props.layout === 'bigImage') {
			imageSize = { w: 270, h: 428 };
		}
		this.props.getNewsArticle(this.props.slug, imageSize);
	}
	componentWillUnmount () {
		this.props.clearNewsArticle();
	}
	smallImage () {
		const article = this.props.news.newsArticle;
		return (
			<div className="news-widget-simple news-widget-portrait">
				<h2>{article.title}</h2>
				<div className="news-widget-portrait-inner">
					{article.image ? <img className="img-portrait" src={article.image.url}/> : null}
					<p>{article.content.lead}</p>
					<Link to={`/react/nyheter/${article.slug}`}>Läs mer.</Link>
				</div>
			</div>
		);
	}
	bigImage () {
		const article = this.props.news.newsArticle;
		return (
			<div className="news-widget-simple news-widget-landscape">
				<Link to={`/react/nyhter/${article.slug}`}>
					<h2>{article.title}</h2>
					<div className="img-landscape-ct">
						{article.image ? <img src={article.image.url} className="img-landscape" /> : null}
					</div>
				</Link>
			</div>
		);
	}
	content () {
		if (this.props.layout === 'smallImage') {
			return this.smallImage();
		} else if (this.props.layout === 'bigImage') {
			return this.bigImage();
		}
	}
	render () {
		return this.props.news.newsArticle.loading ? null : <div className="information-blurb">{this.content()}</div>;
	}
}

const mapStateToProps = ({ news }) => ({ news });

const mapDispatchToProps = (dispatch) => ({
	getNewsArticle: (nyhet, querystring) => dispatch(getNewsArticle(nyhet, querystring)),
	getNews: () => dispatch(getNews()),
	clearNewsArticle: () => dispatch(clearNewsArticle()),
});

NewsItemWidget.propTypes = {
	layout: PropTypes.oneOf(['smallImage', 'bigImage']),
	slug: PropTypes.string,
 };

export default connect(mapStateToProps, mapDispatchToProps)(NewsItemWidget);
