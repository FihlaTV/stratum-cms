import React from 'react';
import Spinner from './Spinner';

const SITHSLogin = ({
    status
}) => {
	switch (status){
		case 'SITHS_INTRO':
			return (
				<div>
					<h1>SITHS</h1>
					<p>Försäkra dig om att ditt SITHS-kort sitter i datorn</p>
					<p>I nästa steg kommer din webbläsare att efterfråga ett certifikat, välj där det som är förknippat med ditt namn och tryck på OK</p>
				</div>
			);
		case 'SITHS_DO_LOGIN':
			return (
				<div>
					<h1>SITHS</h1>
					<Spinner/>
				</div>
			);
		default :
			return <h1>SITHS</h1>
	}
}

export default SITHSLogin;