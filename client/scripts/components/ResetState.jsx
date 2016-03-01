import React, { Component, PropTypes } from 'react';

 
const ResetState = ({
	onClick,
	children = 'Avbryt'
}) => {
	return (
		<button className="btn btn-primary" onClick={ 
			e => {
				e.preventDefault();
				onClick();
			}}>{children}</button>
	);
}

ResetState.propTypes = {
	onClick: PropTypes.func.isRequired
};

 export default ResetState;