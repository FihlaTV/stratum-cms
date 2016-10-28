import React from 'react';

/* const PageLi = ({news, page, changeCurrentPage}) => (
	<li className={page === news.currentPage ? 'active' : null} key={page}>
		<a>{page}</a>
	</li>
); */
const NewsPagination = ({ news, incrementCurrentPage, decrementCurrentPage, changeCurrentPage }) => {
	const isFirst = news.currentPage === 1;
	const isLast = news.currentPage >= news.pages.length - 1;
	return (
		<ul className="pagination">
			<li className={isFirst ? 'disabled' : null}>
				<a onClick={decrementCurrentPage}>
					<span className="glyphicon glyphicon-chevron-left"></span>
				</a>
			</li>
				{news.pages.map(page => (
					<li className={page === news.currentPage ? 'active' : null}
						key={page}
						onClick={() => changeCurrentPage(page)}
					>
						<a>{page}</a>
					</li>))
				}
			<li className={isLast ? 'disabled' : null}>
				<a onClick={incrementCurrentPage}>
					<span className="glyphicon glyphicon-chevron-right"></span>
				</a>
			</li>
		</ul>
	);
};

export default NewsPagination;
