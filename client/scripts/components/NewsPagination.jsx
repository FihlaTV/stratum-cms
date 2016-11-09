import React, { Component } from 'react';
import { Link } from 'react-router';

/* const PageLi = ({news, page, changeCurrentPage}) => (
	<li className={page === news.currentPage ? 'active' : null} key={page}>
		<a>{page}</a>
	</li>
); */
/*
const NewsPagination = ({ news, incrementCurrentPage, decrementCurrentPage, changeCurrentPage }) => {
	const isFirst = news.currentPage <= 1;
	const isLast = news.currentPage >= news.pages.length;
	const paginationNumbers = () => {
		let lowerPagination = news.currentPage >= 7 ? news.currentPage - 4 : 0;
		let upperPagination = news.currentPage <= news.pages.length - 6 ? news.currentPage + 4 : news.pages.length;
		if (lowerPagination >= news.pages.length - 10) {
			lowerPagination = news.pages.length - 10;
		}
		if (upperPagination <= 10) {
			upperPagination = 10;
		}
		return news.pages.slice(lowerPagination, upperPagination);
	};
	return (
		<ul className="pagination">
			<li className={isFirst ? 'disabled' : null}>
				<a onClick={decrementCurrentPage}>
					<span className="glyphicon glyphicon-chevron-left"></span>
				</a>
			</li>
			{news.currentPage >= 7 && news.pages.length >= 10 ? <li><a onClick={() => changeCurrentPage(1)}>...</a></li> : null}
				{paginationNumbers().map(page => (
					<li className={page === news.currentPage ? 'active' : null}
						key={page}
						onClick={() => changeCurrentPage(page)}
					>
						<a>{page}</a>
					</li>))
				}
			{news.currentPage <= news.pages.length - 6 && news.pages.length >= 10 ? <li><a onClick={() => changeCurrentPage(news.pages.length)}>...</a></li> : null}
			<li className={isLast ? 'disabled' : null}>
				<a onClick={incrementCurrentPage}>
					<span className="glyphicon glyphicon-chevron-right"></span>
				</a>
			</li>
		</ul>
	);
};
*/
class NewsPagination extends Component {
	constructor (props, context) {
		super(props);
	}
	componentDidMount () {
		const { location, news } = this.props;
		const { page } = this.props.location.query;
		if (parseInt(page) > news.pages.length) {
			this.props.router.replace({ pathname: location.pathname, query: Object.assign({}, location.query, { page: news.pages.length }) });
		} else if (page) {
			this.props.changeCurrentPage(parseInt(page));
		}
	}
	componentWillReceiveProps (nextProps) {
		if (parseInt(nextProps.location.query.page) > nextProps.news.pages.length) {
			this.props.router.replace({ pathname: location.pathname, query: Object.assign({}, nextProps.location.query, { page: nextProps.news.pages.length }) });
		} else if (parseInt(nextProps.location.query.page) < 1) {
			this.props.router.replace({ pathname: location.pathname, query: Object.assign({}, nextProps.location.query, { page: 1 }) });
		}
		if (nextProps.location.query.page !== this.props.location.query.page) {

			this.props.changeCurrentPage(parseInt(nextProps.location.query.page));
		}
	}
	changeCurrentPage (page) {
		const { news, location } = this.props;
		if (page > 0 && page <= news.pages.length) {

			return { pathname: location.pathname, query: Object.assign({}, location.query, { page: page }) };
		} else {
			return { pathname: location.pathname, query: Object.assign({}, location.query, { page: 1 }) };
		}
	}
	incrementCurrentPage () {
		const { location, news } = this.props;
		if (parseInt(location.query.page) < news.pages.length) {
			return parseInt(location.query.page) + 1;
		} else {
			return news.pages.length;
		}
	}
	decrementCurrentPage () {
		const { location } = this.props;
		if (parseInt(location.query.page) > 1) {
			return parseInt(location.query.page) - 1;
		} else {
			return 1;
		}
	}
	paginationNumbers () {
		const { news } = this.props;
		let lowerPagination = news.currentPage >= 7 ? news.currentPage - 4 : 0;
		let upperPagination = news.currentPage <= news.pages.length - 6 ? news.currentPage + 4 : news.pages.length;
		if (lowerPagination >= news.pages.length - 10) {
			lowerPagination = news.pages.length - 10;
		}
		if (upperPagination <= 10) {
			upperPagination = 10;
		}
		return news.pages.slice(lowerPagination, upperPagination);
	}
	render () {
		const { news } = this.props;
		const isFirst = news.currentPage <= 1;
		const isLast = news.currentPage >= news.pages.length;
		return (
			<ul className="pagination">
				<li className={isFirst ? 'disabled' : null}>
					<Link to={this.changeCurrentPage(this.decrementCurrentPage())}>
						<span className="glyphicon glyphicon-chevron-left"></span>
					</Link>
				</li>
				{news.currentPage >= 7 && news.pages.length >= 10 ? <li> <Link to={this.changeCurrentPage(1)}>...</Link></li> : null}
					{this.paginationNumbers().map(page => (
						<li className={page === news.currentPage ? 'active' : null}
							key={page}
						>
							<Link to={this.changeCurrentPage(page)}>{page}</Link>
						</li>))
					}
				{news.currentPage <= news.pages.length - 6 && news.pages.length >= 10 ? <li><Link to={this.changeCurrentPage(news.pages.length)}>...</Link></li> : null}
				<li className={isLast ? 'disabled' : null}>
					<Link to={this.changeCurrentPage(this.incrementCurrentPage())}>
						<span className="glyphicon glyphicon-chevron-right"></span>
					</Link>
				</li>
			</ul>
		);
	}
}

export default NewsPagination;
