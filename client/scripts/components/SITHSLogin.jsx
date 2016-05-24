import React from 'react';
import Spinner from './Spinner';
import Alert from './Alert';

const SITHSLogin = ({
    status
}) => {
	switch (status){
		case 'SITHS_INTRO':
			return (
				<Alert alertType="info">
					<p><strong>Först!</strong> Se till att ditt SITHS-kort sitter i datorn. Klicka sen på Nästa.</p>
				</Alert>
			);
		case 'SITHS_DO_LOGIN':
			return (
				<div>
					<Spinner/>
				</div>
			);
		default :
			return <h1>SITHS</h1>
	}
};

export default SITHSLogin;
