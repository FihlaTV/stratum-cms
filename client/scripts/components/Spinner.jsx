import React, { PropTypes } from 'react';

const Spinner = ({small, style}) => 
    (
		<div className={small ? 'spinner spinner-small' : 'spinner'} style={style}>
			<div className="rect1"></div>
			<div className="rect2"></div>
			<div className="rect3"></div>
			<div className="rect4"></div>
			<div className="rect5"></div>
      </div>
	);

Spinner.propTypes = {
	small: PropTypes.bool	
};

export default Spinner;
