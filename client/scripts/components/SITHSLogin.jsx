import React from 'react';
import Spinner from './Spinner';
import Alert from './Alert';

const SITHSLogin = ({
    status
}) => {
	switch (status){
		case 'SITHS_INTRO':
			return (
				<Alert alertType="info" faIcon="fa-info">
					<p><strong>Först!</strong> Försäkra dig om att ditt SITHS-kort sitter i datorn</p>
					<p>I nästa steg kommer din webbläsare att efterfråga ett certifikat, välj där det som är förknippat med ditt namn och tryck på OK</p>
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
}

export default SITHSLogin;