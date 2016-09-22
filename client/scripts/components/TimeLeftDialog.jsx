import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const TimeLeftDialog = ({
	timeleft,
	show,
	onDismiss,
}) => {
	const body = timeleft > 0
		? 'Du har nu mindre än tre minuter kvar innan du blir automatiskt utloggad. Klicka på Avbryt om du vill fortsätta vara inloggad.'
		: 'Du är nu utloggad. För säkerhets skull bör du också stänga din webbläsare.';
	const buttonText = timeleft > 0 ? 'Avbryt' : 'Stäng';
	return (
		<div>
			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>Automatisk utloggning</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{body}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => onDismiss(timeleft)}>{buttonText}</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

TimeLeftDialog.propTypes = {};

export default TimeLeftDialog;
