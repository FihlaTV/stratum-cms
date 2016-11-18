import moment from 'moment';
import 'moment/locale/sv';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import Spinner from '../components/Spinner';
import DockedImages from '../components/DockedImages';
import Resources from '../components/Resources';
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
	author () {
		const author = this.props.news.newsArticle.author;
		return (
			<div className="news-item-author">
				<img src={author.image.url} alt={`${author.name.first} ${author.name.last}`} height="80" width="80"/>
				<div className="news-item-author-info">
					<span className="news-item-name">{`${author.name.first} ${author.name.last}`}</span>
					<a href={`mailto:${author.email}`} className="news-item-email">{author.email}</a>
				</div>
			</div>
		);
	}
	landscape (image) {
		return (
			<div className="caption-ct base-page-head-image base-page-head-image-full">
				<img src={image.url} className="news-item-main-img img-responsive" width="750" />
				{image.description && <div className="caption-text">{image.description}</div>}
			</div>
		);
	}

	newsItem () {
		const newsItem = this.props.news.newsArticle;
		return (
			<div className="news-item-full">
				<Row>
					<Col md={8}>
						<article className="base-page clearfix">
							<header>
								<span className="published-at">{moment(this.props.news.newsArticle.publishedDate).format('L')}</span>
								<h1>{newsItem.title}</h1>
							</header>
							{newsItem.imageLayout === 'landscape' && newsItem.image.url ? this.landscape(newsItem.image) : null}
							<div className="post">
								<p className="lead">{newsItem.content.lead}</p>
								<div dangerouslySetInnerHTML={{ __html: newsItem.content.extended.html }}></div>
							</div>
							{newsItem.author ? this.author() : null}
						</article>
					</Col>
					<Col md={4}>{newsItem.imageLayout === 'portrait' && newsItem.image.url && <DockedImages images={[newsItem.image]} enlargeable wide={false} />}
					{newsItem.resources.length > 0 && <Resources resources={newsItem.resources} />}
					</Col>
				</Row>
			</div>
		);
	}
	render () {
		return this.props.news.newsArticle.loading ? <Spinner /> : this.newsItem();
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
