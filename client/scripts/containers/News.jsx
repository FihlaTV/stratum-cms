import React, { Component } from 'react';
import { Col, Row, Pagination } from 'react-bootstrap';
import NewsListItem from '../components/NewsListItem';
import NewsFilter from '../components/NewsFilter';
// import Spinner from '../components/Spinner';
import {
	fetchNewsItemsIfNeeded,
	changeYearFilter,
	changeCurrentPage,
} from '../actions/news';
import { setBreadcrumbs, clearBreadcrumbs } from '../actions/breadcrumbs';
import { connect } from 'react-redux';

class News extends Component {
	componentDidMount() {
		const { title, setBreadcrumbs, fetchNewsItemsIfNeeded } = this.props;

		fetchNewsItemsIfNeeded();
		setBreadcrumbs([{ url: '/nyheter/', label: title }], true, title);
	}
	componentWillUnmount() {
		this.props.clearBreadcrumbs();
	}
	navigateToPage(pageNr) {
		const { query, pathname } = this.props.location;

		this.props.router.push({
			pathname: pathname,
			query: Object.assign({}, query, {
				page: pageNr === 1 ? undefined : pageNr,
			}),
		});
	}
	render() {
		const {
			items,
			children,
			title,
			loading,
			currentYear,
			currentPage,
			itemsPerYear,
			location,
			itemsPerPage,
		} = this.props;
		if (children) {
			return children;
		}
		if (!loading) {
			let paginationItems = [];
			let pages = Math.ceil(items.length / itemsPerPage) || 1;
			for (let i = 1; i <= pages; i++) {
				paginationItems.push(
					<Pagination.Item
						key={`pagination-item-${i}`}
						active={i === currentPage}
						onClick={() => this.navigateToPage(i)}
					>
						{i}
					</Pagination.Item>
				);
			}
			return (
				<div>
					<h1>{title}</h1>
					<p>Antal artiklar: {items.length}</p>
					<Row>
						<Col md={8}>
							{items
								.slice(
									currentPage * itemsPerPage - itemsPerPage,
									currentPage * itemsPerPage
								)
								.map(({ slug, state, ...rest }) => (
									<NewsListItem
										key={slug}
										slug={slug}
										state={state}
										{...rest}
									/>
								))}
							<Pagination>
								<Pagination.Prev
									disabled={currentPage === 1}
									onClick={() =>
										this.navigateToPage(currentPage - 1)
									}
								/>
								{paginationItems}
								<Pagination.Next
									disabled={pages === currentPage}
									onClick={() =>
										this.navigateToPage(currentPage + 1)
									}
								/>
							</Pagination>
						</Col>
						<Col md={4}>
							<NewsFilter
								year={currentYear}
								itemsPerYear={itemsPerYear}
								pathname={location.pathname}
								query={location.query}
							/>
						</Col>
					</Row>
				</div>
			);
		} else {
			return null;
		}
	}
}

function getFilteredNews(items = [], year, page) {
	if (year === ' draft') {
		return items.filter(({ state }) => {
			return state === 'draft';
		});
	} else if (year !== 'all') {
		return items.filter(({ publishedDate }) => {
			return new Date(publishedDate).getFullYear() === parseInt(year, 10);
		});
	}
	return items;
}

const mapStateToProps = ({ news, breadcrumbs }, { location }) => {
	const { page = 1, year = 'all' } = location.query;
	return {
		items: getFilteredNews(news.items, year, page),
		loading: news.loading,
		currentPage: parseInt(page, 10),
		currentYear: year,
		breadcrumbs,
		itemsPerYear: news.itemsPerYear,
		title: news.title,
	};
};

const mapDispatchToProps = dispatch => ({
	fetchNewsItemsIfNeeded: () => dispatch(fetchNewsItemsIfNeeded()),
	changeYearFilter: year => dispatch(changeYearFilter(year)),
	changeCurrentPage: page => dispatch(changeCurrentPage(page)),
	setBreadcrumbs: (...args) => dispatch(setBreadcrumbs(...args)),
	clearBreadcrumbs: () => dispatch(clearBreadcrumbs()),
});

News.defaultProps = {
	title: 'Nyheter och meddelanden',
	itemsPerPage: 5,
};

export default connect(mapStateToProps, mapDispatchToProps)(News);
