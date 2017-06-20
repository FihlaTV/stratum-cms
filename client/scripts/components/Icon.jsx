import React, { PropTypes } from 'react';

const Icon = ({
	name,
}) => (
	<span aria-hidden="true" className={`fa fa-${name}`}></span>
);

Icon.propTypes = {
	name: PropTypes.string.isRequired,
};

export default Icon;
