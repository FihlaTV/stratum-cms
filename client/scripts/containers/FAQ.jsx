import React, { PropTypes } from 'react';

const FAQ = ({
	categories = [],
}) => {
	return (
		<div>
			{categories.map((id) => {
				return <h2 key={id}>{id}</h2>;
			})}
		</div>
	);
};

FAQ.propTypes = {
	categories: PropTypes.array,
};

export default FAQ;
