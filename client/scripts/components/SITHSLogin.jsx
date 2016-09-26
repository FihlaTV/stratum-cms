import React from 'react';
import Spinner from './Spinner';
import Alert from './Alert';
import NewCardDialog from './NewCardDialog';

const SITHSLogin = ({
    status,
	onNewCardSubmit = () => {},
	onNewCardChange = () => {},
}) => {
	switch (status) {
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
				<div>
					<Alert alertType="info">
						<p><strong>Håller du på att logga in första gången?</strong></p>
						<p>Då ska du fylla i de uppgifter du fått för engångsbruk.</p>
					</Alert>
					<NewCardDialog
						onSubmit={onNewCardSubmit}
						onChange={onNewCardChange}
					/>
				</div>
			);
		default :
			return <h1>SITHS</h1>;
	}
};

export default SITHSLogin;
