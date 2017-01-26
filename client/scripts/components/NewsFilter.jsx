import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

const Year = ({ year, count, pathname, query, active, children }) => {
	const filterQuery = { year: year === 'all' ? undefined : year, page: undefined };
	return (<li>
		{active
			? <Link to={{ pathname: pathname, query: Object.assign({}, query, filterQuery) }}>
				{children}
			</Link>
			: children
		}
	</li>);
};

const NewsFilter = ({ itemsPerYear = {}, year: currentYear, pathname, query }) => (
	<div className="news-filter side-area">
		<h2>Filtrera nyheter</h2>
		<span className="news-filter-header">År</span>
		<ul className="news-filter-list">
			{Object.keys(itemsPerYear).reverse().map(year => (
				<Year key={year} pathname={pathname} query={query} year={year} count={itemsPerYear[year]} active={year !== currentYear}>
					{year === 'all' ? 'Alla' : year} ({itemsPerYear[year]})
				</Year>
			))}
		</ul>
	</div>
);

NewsFilter.propTypes = {
	itemsPerYear: PropTypes.shape({
		all: PropTypes.number,
	}),
	pathname: PropTypes.string,
	year: PropTypes.string,
};

Year.propTypes = {
	active: PropTypes.bool.isRequired,
	year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default NewsFilter;
