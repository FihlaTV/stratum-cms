import moment from 'moment';
import 'moment/locale/sv';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import Spinner from '../components/Spinner';
import DockedImages from '../components/DockedImages';
import ResourceList from '../components/ResourceList';
import { getNewsArticle, clearNewsArticle } from '../actions/news';
import { setBreadcrumbs, clearBreadcrumbs } from '../actions/breadcrumbs';
import { connect } from 'react-redux';

class NewsItem extends Component {
	componentDidMount() {
		const { title, slug, params, getNewsArticle } = this.props;
		getNewsArticle(params.nyhet);
		if (slug) {
			this.setBreadcrumbs(title, slug);
		}
	}
	componentWillReceiveProps({ title, slug }) {
		if (!this.props.slug && slug) {
			this.setBreadcrumbs(title, slug);
		}
	}
	componentWillUnmount() {
		const { clearNewsArticle, parentTitle, setBreadcrumbs } = this.props;
		// Set breadcrumbs to parent view since this will unmount before parent view unmounts.
		setBreadcrumbs(
			[{ url: '/nyheter/', label: parentTitle }],
			true,
			parentTitle
		);
		clearNewsArticle();
	}
	setBreadcrumbs(title, slug) {
		const { parentTitle, setBreadcrumbs } = this.props;
		setBreadcrumbs(
			[
				{ url: 'nyheter', label: parentTitle },
				{ url: `nyheter/${slug}`, label: title },
			],
			true,
			title
		);
	}
	getAuthorComponent({ image, name, email }) {
		return (
			<div className="news-item-author">
				<img
					src={image.url}
					alt={`${name.first} ${name.last}`}
					height="80"
					width="80"
				/>
				<div className="news-item-author-info">
					<span className="news-item-name">{`${name.first} ${
						name.last
					}`}</span>
					<a href={`mailto:${email}`} className="news-item-email">
						{email}
					</a>
				</div>
			</div>
		);
	}
	landscape({ url, description }) {
		return (
			<div className="caption-ct base-page-head-image base-page-head-image-full">
				<img
					src={url}
					className="news-item-main-img img-responsive"
					width="750"
				/>
				{description && (
					<div className="caption-text">{description}</div>
				)}
			</div>
		);
	}

	newsItem() {
		const {
			publishedDate,
			title,
			imageLayout,
			image,
			content = {},
			author,
			resources = [],
			extraImages = [],
			state,
			isEnglish,
		} = this.props;
		const isModernTheme = process.env.CLIENT_THEME === 'modern';
		var publishedAt =
			publishedDate !== null
				? moment(publishedDate).format('L')
				: 'Utkast';
		return (
			<div className="news-item-full">
				<Row>
					<Col md={8}>
						<article
							className={
								`base-page clearfix` +
								`${
									state === 'draft'
										? ' draft draft-banner'
										: ''
								}`
							}
						>
							<header>
								<span className="published-at">
									{publishedAt}
								</span>
								<h1>{title}</h1>
							</header>
							{imageLayout === 'landscape' &&
								image &&
								this.landscape(image)}
							<div className="post">
								<p className="lead">{content.lead}</p>
								{content.extended && (
									<div
										dangerouslySetInnerHTML={{
											__html: content.extended.html,
										}}
									/>
								)}
							</div>
							{author && this.getAuthorComponent(author)}
						</article>
					</Col>
					<Col md={4}>
						{imageLayout === 'portrait' &&
							image && (
								<DockedImages
									images={[image]}
									enlargeable
									wide={false}
								/>
							)}
						{resources.length > 0 && (
							<ResourceList
								resources={resources}
								inContainer={isModernTheme}
								isEnglish={isEnglish}
							/>
						)}
					</Col>
					<Col md={4}>
						<DockedImages
							imageSMCols={12}
							imageMDCols={12}
							images={extraImages}
							enlargeable
						/>
					</Col>
				</Row>
			</div>
		);
	}
	render() {
		return this.loading ? <Spinner /> : this.newsItem();
	}
}

const mapStateToProps = ({ news }) => {
	return { ...news.newsArticle, parentTitle: news.title };
};

const mapDispatchToProps = dispatch => ({
	getNewsArticle: nyhet => dispatch(getNewsArticle(nyhet)),
	clearNewsArticle: () => dispatch(clearNewsArticle()),
	setBreadcrumbs: (...bcArgs) => dispatch(setBreadcrumbs(...bcArgs)),
	clearBreadcrumbs: (...args) => dispatch(clearBreadcrumbs(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsItem);
