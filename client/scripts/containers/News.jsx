import React from 'react';
import { Col, Row } from 'react-bootstrap';
import NewsListItem from '../components/NewsListItem';
import NewsFilter from '../components/NewsFilter';
import NewsPagination from '../components/NewsPagination';
import Spinner from '../components/Spinner';
import { getNews, changeYearFilter, changeCurrentPage } from '../actions/news';
import { connect } from 'react-redux';

const News = (props) => {
	const { news } = props;
	if (!news.loading) {
		return (
			<div>
				<Row>
					<Col md={8}>
						{props.news.filteredNews.slice(news.currentPage * 5 - 5, news.currentPage * 5).map(article => <NewsListItem key={article.title} article={article} />)}
					</Col>
					<Col md={4}>
						<NewsFilter {...props} />
					</Col>
				</Row>
				<NewsPagination {...props} />
			</div>
		);
	}	else {
		props.getNews();
		return <Spinner />;
	}
};

const mapStateToProps = ({ news }) => {
	return { news };
};

const mapDispatchToProps = (dispatch) => ({
	getNews: () => dispatch(getNews()),
	changeYearFilter: (year) => dispatch(changeYearFilter(year)),
	changeCurrentPage: (page) => dispatch(changeCurrentPage(page)),
});
export default connect(mapStateToProps, mapDispatchToProps)(News);
