import React, { Component, PropTypes } from 'react';

 
const NextButton = (props) => {
	const {children = 'Nästa', onClick, isLoading, loadingText = 'Laddar', ...other} = props;
	const spinner = (<span>{loadingText} <i className="fa fa-circle-o-notch fa-spin"></i></span>);
	return (
		<button {...other} className="btn btn-primary" onClick={ 
			e => {
				e.preventDefault();
				onClick();
			}}>{isLoading ? spinner : children}</button>
	);
}

NextButton.propTypes = {
	onClick: PropTypes.func.isRequired
};

 export default NextButton;