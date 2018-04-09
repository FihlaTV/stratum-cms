import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getNewsArticle, getNews, clearNewsArticle } from '../actions/news';
import NewsLink from '../components/NewsLink';

class NewsItemWidget extends Component {
	componentDidMount() {
		let imageSize;
		if (this.props.layout === 'smallImage') {
			imageSize = { width: 150, height: 185 };
		} else if (this.props.layout === 'bigImage') {
			imageSize = { width: 428, height: 270 };
		}
		this.props.getNewsArticle(this.props.slug, imageSize);
	}
	componentWillUnmount() {
		this.props.clearNewsArticle();
	}
	smallImage({ slug, title, image, content }) {
		return (
			<div className="news-widget-simple news-widget-portrait">
				<h2>{title}</h2>
				<div className="news-widget-portrait-inner">
					{image && <img className="img-portrait" src={image.url} />}
					<p>{content.lead}</p>
					<NewsLink slug={slug}>Läs mer.</NewsLink>
				</div>
			</div>
		);
	}
	bigImage({ slug, title, image }) {
		return (
			<div className="news-widget-simple news-widget-landscape">
				<NewsLink slug={slug}>
					<h2>{title}</h2>
					<div className="img-landscape-ct">
						{image && (
							<img src={image.url} className="img-landscape" />
						)}
					</div>
				</NewsLink>
			</div>
		);
	}
	content() {
		const { slug, title, image, content } = this.props;
		if (this.props.layout === 'smallImage') {
			return this.smallImage({ slug, title, image, content });
		} else if (this.props.layout === 'bigImage') {
			return this.bigImage({ slug, title, image });
		}
	}
	render() {
		return this.props.loading ? null : (
			<div className="information-blurb">{this.content()}</div>
		);
	}
}

const mapStateToProps = ({ news }) => ({ ...news.newsArticle });

const mapDispatchToProps = dispatch => ({
	getNewsArticle: (nyhet, querystring) =>
		dispatch(getNewsArticle(nyhet, querystring)),
	getNews: () => dispatch(getNews()),
	clearNewsArticle: () => dispatch(clearNewsArticle()),
});

NewsItemWidget.propTypes = {
	layout: PropTypes.oneOf(['smallImage', 'bigImage']),
	slug: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsItemWidget);
