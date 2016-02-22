import React, { Component, PropTypes } from 'react';

 
const NextButton = (props) => {
	const {children, onClick, ...other} = props;
	return (
		<button {...other} className="btn btn-primary" onClick={ 
			e => {
				e.preventDefault();
				onClick();
			}}>{children || 'Nästa'}</button>
	);
}

NextButton.propTypes = {
	onClick: PropTypes.func.isRequired
};

 export default NextButton;