import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

const YearLi = ({ year, news, changeYearFilter, location, active }) => (
	<li>
		<Link to={{ pathname: location.pathname, query: Object.assign({}, location.query, { year: year, page: 1 }) }}
			style={active ? { color: 'black' } : {}}	>
			{`${year} (${news.articlesPerYear[year]})`}
		</Link>
	</li>
);

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
			<div className="news-filter side-area">
				<h2>Filtrera nyheter</h2>
				<span className="news-filter-header">År</span>
				<ul className="news-filter-list">
					<li>
						<Link
							to={{ pathname: location.pathname, query: Object.assign({}, location.query, { year: 'alla', page: 1 }) }}
							style={location.query.year === 'alla' || location.query.year === undefined ? { color: 'black' } : {}}
						>Alla ({news.articlesPerYear.all})</Link>
					</li>
					{news.filterYears.sort((yearA, yearB) => yearA < yearB).map(year => <YearLi key={year} {...this.props} year={year} active={year === parseInt(location.query.year)}/>)}
				</ul>
			</div>
		);
	}
}

NewsFilter.propTypes = {
	changeYearFilter: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	news: PropTypes.object.isRequired,
};

YearLi.propTypes = {
	active: PropTypes.bool.isRequired,
	changeYearFilter: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	news: PropTypes.object.isRequired,
	year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default NewsFilter;
