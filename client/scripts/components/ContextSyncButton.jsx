import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';


const ContextSyncButton = (props) => {
	const {
		onClick, 
		isSyncing, 
		disabled,
		children,
		...other
	} = props;
	
	return (
		<Button bsStyle="primary" block onClick={onClick} disabled={disabled || isSyncing} {...other}>
			{isSyncing ? (<i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i>) : children}
		</Button>
	);
};

ContextSyncButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	isSyncing: PropTypes.bool
};

export default ContextSyncButton;
