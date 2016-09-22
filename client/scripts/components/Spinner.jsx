import React, { PropTypes } from 'react';

const Spinner = ({ small, style }) =>
	(<div className={small ? 'spinner spinner-small' : 'spinner'} style={style}>
		<div className="rect1" />
		<div className="rect2" />
		<div className="rect3" />
		<div className="rect4" />
		<div className="rect5" />
	</div>);

Spinner.propTypes = {
	small: PropTypes.bool,
};

export default Spinner;
