import React, { Component, PropTypes } from 'react';

 
const ResetState = ({
	onClick
}) => {
	return (
		<button className="btn btn-primary" onClick={ 
			e => {
				e.preventDefault();
				onClick();
			}}>Avbryt</button>
	);
}

ResetState.propTypes = {
	onClick: PropTypes.func.isRequired
};

 export default ResetState;