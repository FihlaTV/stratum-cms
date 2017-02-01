import React, { Component } from 'react';

class Registration extends Component {
	componentDidMount () {
		const script = document.createElement('script');

		script.src = '/stratum/api/widgets/RC/Loader?widget=registrations&target=sw-registrations';
		script.async = true;

		document.body.appendChild(script);
	}
	render () {
		return (
			<div>
				<div className="base-page">
					<div id="sw-registrations"></div>
				</div>
			</div>
		);
	}
};

export default Registration;
