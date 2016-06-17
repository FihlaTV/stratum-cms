import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
 
const TimeLeftDialog = ({
	timeleft,
	show,
	onDismiss
}) => {
	const body = timeleft > 0 ? 
		'Du har nu mindre än tre minuter kvar innan du blir automatiskt utloggad. Klicka på Avbryt (eller tryck Esc) om du vill fortsätta vara inloggad.'
		: 'Du är nu utloggad. För säkerhets skull bör du också stänga din webbläsare.';  
	// const minutes = parseInt(Math.ceil(timeleft/60));
	return (
		<div>
			<Modal show={show} onExit={() => console.log('exit')} keyboard={true}>
				<Modal.Header>
					<Modal.Title>Modal title</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{body} 
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => onDismiss(timeleft)}>Avbryt</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

TimeLeftDialog.propTypes = {};

export default TimeLeftDialog;
