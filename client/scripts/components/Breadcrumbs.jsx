import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';


const Breadcrumbs = ({
	items = [],
}) => {
	return items.length > 0 ? (
		<ol className="breadcrumb">
			{items.map(({ url, label }, i) => {
				const isLast = i >= items.length - 1;
				return (
					<li key={i} className={isLast ? 'active' : ''}>
						{!isLast ? <Link to={url}>{label}</Link> : label}
					</li>
				);
			})}
		</ol>
	) : null;

};

Breadcrumbs.propTypes = {
	items: PropTypes.arrayOf(PropTypes.shape({
		url: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	})),
};

export default Breadcrumbs;
