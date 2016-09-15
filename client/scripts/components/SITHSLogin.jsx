import React from 'react';
import Spinner from './Spinner';
import Alert from './Alert';
import NewCardDialog from './NewCardDialog';

const SITHSLogin = ({
    status,
	onPasswordChange,
	onUserChange
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
		case 'SITHS_NEW_CARD':
			return (
				<NewCardDialog 
					onSubmit={(username, password) => console.log('username: %s, password: %s', username, password)}
					onUserChange={onUserChange}	
					onPasswordChange={onPasswordChange}
				/>
			);
		default :
			return <h1>SITHS</h1>;
	}
};

export default SITHSLogin;
