import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Spinner from './Spinner';
class NewsItem extends Component {
	constructor (props) {
		super(props);
		this.state = { loading: true };
	}

	componentDidMount () {
		fetch(`/api/news/${this.props.params.nyhet}`)
			.then(res => res.json())
			.then(json => this.loadData(json.data));
		console.log(this.props.params.nyhet);
	}
	loadData (data) {
		this.setState({ loading: false, newsItem: data });
	}
	formatedPublishedDate () {
		const published = new Date(this.state.newsItem.publishedDate);
		const year = published.getUTCFullYear();
		const month = published.getUTCMonth() + 1;
		const formatedMonth = month < 10 ? '0' + month : month;
		const day = published.getUTCDate();
		return `${year}-${formatedMonth}-${day}`;
	}
	landscapeJSX () {
		return (
			<div className="caption-ct base-page-head-image base-page-head-image-full">
				<img src={this.state.newsItem.image.url} className="news-item-main-img img-responsive" width="750" />
			</div>
		);
	}
	portraitJSX () {
		return (
			<div className="col-md-4 content-page-image">
				<div className="caption-image">
					<img src={this.state.newsItem.image.url} className="img-responsive" width="640" />
				</div>
			</div>
		);
	}
	newsItemJSX () {
		const newsItem = this.state.newsItem;
		return (
			<div className="news-item-full">
				<div className="row">
					<div className="col-md-8">
						<article className="base-page clearfix">
							<header>
								<span className="published-at">{this.formatedPublishedDate()}</span>
								<h1>{newsItem.title}</h1>
							</header>
							{newsItem.imageLayout === 'landscape' ? this.landscapeJSX() : null}
							<div className="post">
								<p className="lead">{newsItem.content.lead}</p>
								<div dangerouslySetInnerHTML={{ __html: newsItem.content.extended.html }}></div>
							</div>
						</article>
					</div>
					{newsItem.imageLayout === 'portrait' ? this.portraitJSX() : null}
				</div>
			</div>
		);
	}
	render () {
		return this.state.loading ? <Spinner /> : this.newsItemJSX();
	}
};

export default NewsItem;
