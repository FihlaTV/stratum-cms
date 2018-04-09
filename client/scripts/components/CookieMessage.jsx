import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Message from './Message';

const CookieMessage
	= ({
		onDismiss,
		status = 'info',
		visible = true,
	}) =>
		visible ? (
			<Message className="clearfix" status={status} visible={visible}>
				<p>
					Vi använder kakor (cookies) för att förbättra din upplevelse.
					Genom att besöka vår webbplats samtycker du till detta.
					Läs <a href="https://pts.se/cookies" target="_blank">om kakor</a> och hur du hindrar att de lagras på din dator.
					Inloggning till register fungerar endast om kakor får användas.
				</p>
				<Button className="pull-right" bsStyle={status} onClick={onDismiss}>Acceptera</Button>
			</Message>
		) : null;

CookieMessage.propTypes = {
	onDismiss: PropTypes.func,
	status: PropTypes.oneOf(['status', 'info', 'warning', 'danger']),
	visible: PropTypes.bool,
};

export default CookieMessage;
