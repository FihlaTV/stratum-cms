import React, { Component } from 'react';
import Spinner from '../components/Spinner';
import { getNewsArticle, clearNewsArticle } from '../actions/news';
import { connect } from 'react-redux';

class NewsItem extends Component {
	constructor (props) {
		super(props);
	}

	componentDidMount () {
		this.props.getNewsArticle(this.props.params.nyhet);
	}
	componentWillUnmount () {
		this.props.clearNewsArticle();
	}
	formatedPublishedDate () {
		const published = new Date(this.props.news.newsArticle.publishedDate);
		const year = published.getUTCFullYear();
		const month = published.getUTCMonth() + 1;
		const formatedMonth = month < 10 ? '0' + month : month;
		const day = published.getDate();
		const formatedDay = day < 10 ? '0' + day : day;
		return `${year}-${formatedMonth}-${formatedDay}`;
	}
	landscapeJSX () {
		return (
			<div className="caption-ct base-page-head-image base-page-head-image-full">
				<img src={this.props.news.newsArticle.image.url} className="news-item-main-img img-responsive" width="750" />
			</div>
		);
	}
	portraitJSX () {
		return (
			<div className="col-md-4 content-page-image">
				<div className="caption-image">
					<img src={this.props.news.newsArticle.image.url} className="img-responsive" width="640" />
				</div>
			</div>
		);
	}
	newsItemJSX () {
		const newsItem = this.props.news.newsArticle;
		return (
			<div className="news-item-full">
				<div className="row">
					<div className="col-md-8">
						<article className="base-page clearfix">
							<header>
								<span className="published-at">{this.formatedPublishedDate()}</span>
								<h1>{newsItem.title}</h1>
							</header>
							{newsItem.imageLayout === 'landscape' && newsItem.image ? this.landscapeJSX() : null}
							<div className="post">
								<p className="lead">{newsItem.content.lead}</p>
								<div dangerouslySetInnerHTML={{ __html: newsItem.content.extended.html }}></div>
							</div>
						</article>
					</div>
					{newsItem.imageLayout === 'portrait' && newsItem.image ? this.portraitJSX() : null}
				</div>
			</div>
		);
	}
	render () {
		return this.props.news.newsArticle.loading ? <Spinner /> : this.newsItemJSX();
	}
};

const mapStateToProps = ({ news }) => {
	return { news };
};

const mapDispatchToProps = (dispatch) => ({
	getNewsArticle: (nyhet) => dispatch(getNewsArticle(nyhet)),
	clearNewsArticle: () => dispatch(clearNewsArticle()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsItem);
