import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import NewsListItem from '../components/NewsListItem';
import NewsFilter from '../components/NewsFilter';
import NewsPagination from '../components/NewsPagination';
import Spinner from '../components/Spinner';
import { getNews, changeYearFilter, changeCurrentPage } from '../actions/news';
import { setBreadcrumbs, clearBreadcrumbs } from '../actions/breadcrumbs';
import { connect } from 'react-redux';

class News extends Component {
	constructor (props) {
		super(props);
	}
	componentDidMount () {
		const { title, setBreadcrumbs } = this.props;
		setBreadcrumbs([{ url: '/nyheter/', label: title }], true, title);
	}
	componentWillUnmount () {
		this.props.clearBreadcrumbs();
	}
	render () {
		const { news, children, title } = this.props;
		if (children) {
			return children;
		}
		if (!news.loading) {
			return (
				<div>
					<h1>{title}</h1>
					<p>Antal artiklar: {news.filteredNews.length}</p>
					<Row>
						<Col md={8}>
							{news.filteredNews
								.slice(news.currentPage * 5 - 5, news.currentPage * 5)
								.map(({ slug, ...rest }) => (
									<NewsListItem key={slug} slug={slug} {...rest}/>
								))
							}
						</Col>
						<Col md={4}>
							<NewsFilter {...this.props} />
						</Col>
					</Row>
					<NewsPagination {...this.props} />
				</div>
			);
		}	else {
			this.props.getNews();
			return <Spinner />;
		}
	}
};

const mapStateToProps = ({ news, breadcrumbs }) => {
	return { news, breadcrumbs };
};

const mapDispatchToProps = (dispatch) => ({
	getNews: () => dispatch(getNews()),
	changeYearFilter: (year) => dispatch(changeYearFilter(year)),
	changeCurrentPage: (page) => dispatch(changeCurrentPage(page)),
	setBreadcrumbs: (...args) => dispatch(setBreadcrumbs(...args)),
	clearBreadcrumbs: () => dispatch(clearBreadcrumbs()),
});

News.defaultProps = {
	title: 'Nyheter',
};

export default connect(mapStateToProps, mapDispatchToProps)(News);
