import React, { Component } from 'react';
import StratumLoader, { startRegistrations } from '../utils/stratumLoader';

class Registration extends Component {
	componentDidMount () {
		const { containerId, widget } = this.props;

		if (typeof window.Stratum !== 'undefined' && window.Stratum.ApplicationForRegistrations) {
			startRegistrations();
		} else {
			StratumLoader(containerId, widget);
		}
	}
	componentWillUnmount () {
		const { Ext, purgeOrphans } = window;
		const { containerId } = this.props;
		if (typeof purgeOrphans !== 'undefined' && typeof Ext !== 'undefined') {
			purgeOrphans(document.getElementById(containerId));
		}
	}
	render () {
		const { containerId } = this.props;
		return (
			<div>
				<div className="base-page base-page-full">
					<div id={containerId}></div>
				</div>
			</div>
		);
	}
}

Registration.defaultProps = {
	registrationId: `registration-script-${(new Date()).getTime()}`,
	containerId: 'sw-registrations',
	widget: 'registrations',
};

export default Registration;
