import React from 'react';

/* const PageLi = ({news, page, changeCurrentPage}) => (
	<li className={page === news.currentPage ? 'active' : null} key={page}>
		<a>{page}</a>
	</li>
); */
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

export default NewsPagination;
