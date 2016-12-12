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
		this.props.setBreadcrumbs([{ url: '/nyheter/', label: 'Nyheter' }]);
	}
	componentWillUnmount () {
		this.props.clearBreadcrumbs();
	}
	render () {
		const { news, children } = this.props;
		if (children) {
			return children;
		}
		if (!news.loading) {
			return (
				<div>
					<h1>Nyheter och meddelanden</h1>
					<p>Antal artiklar: {news.filteredNews.length}</p>
					<Row>
						<Col md={8}>
							{news.filteredNews.slice(news.currentPage * 5 - 5, news.currentPage * 5).map(article => <NewsListItem key={article.title} article={article} setBreadcrumbs={this.props.setBreadcrumbs}/>)}
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
	setBreadcrumbs: (bcArr) => dispatch(setBreadcrumbs(bcArr)),
	clearBreadcrumbs: () => dispatch(clearBreadcrumbs()),
});
export default connect(mapStateToProps, mapDispatchToProps)(News);
