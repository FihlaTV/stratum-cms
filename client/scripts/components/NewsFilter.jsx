import React from 'react';

const YearLi = ({ year, news, changeYearFilter }) => <li onClick={() => changeYearFilter(year)} >{`${year} (${news.articlesPerYear[year]})`}</li>;

const NewsFilter = (props) => {
	const news = props.news;
	return (
		<div className="news-filter">
			<h2>Filtrera nyheter</h2>
			<span className="news-filter-header">År</span>
			<ul className="news-filter-list">
				<li onClick={() => props.changeYearFilter('Alla')}>Alla ({news.articlesPerYear.all})</li>
				{news.filterYears.sort((yearA, yearB) => yearA < yearB).map(year => <YearLi key={year} {...props} year={year} />)}
			</ul>
		</div>
	);
};

export default NewsFilter;
