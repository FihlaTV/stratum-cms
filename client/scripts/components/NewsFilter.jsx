import React, { Component } from 'react';
import { Link } from 'react-router';

const YearLi = ({ year, news, changeYearFilter, location }) => <li><Link to={{ pathname: location.pathname, query: Object.assign({}, location.query, { year: year, page: 1 }) }}>{`${year} (${news.articlesPerYear[year]})`}</Link></li>;

class NewsFilter extends Component {
	constructor (props) {
		super(props);
	}
	componentWillMount () {
		if (this.props.location.query.year) {
			this.props.changeYearFilter(this.props.location.query.year === 'alla' || !this.props.location.query.year ? 'alla' : parseInt(this.props.location.query.year));
		}
	}
	componentWillReceiveProps (nextProps) {
		if (nextProps.location.query.year !== this.props.location.query.year) {
			this.props.changeYearFilter(nextProps.location.query.year === 'alla' || !nextProps.location.query.year ? 'alla' : parseInt(nextProps.location.query.year));
		}
	}
	render () {
		const news = this.props.news;
		const location = this.props.location;
		return (
			<div className="news-filter">
				<h2>Filtrera nyheter</h2>
				<span className="news-filter-header">År</span>
				<ul className="news-filter-list">
					<li> <Link to={{ pathname: location.pathname, query: Object.assign({}, location.query, { year: 'alla', page: 1 }) }}>Alla ({news.articlesPerYear.all})</Link></li>
					{news.filterYears.sort((yearA, yearB) => yearA < yearB).map(year => <YearLi key={year} {...this.props} year={year} />)}
				</ul>
			</div>
		);
	}
}

export default NewsFilter;
