import React, { Component } from 'react';
import StratumLoader, { startRegistrations } from '../utils/stratumLoader';
import Spinner from './Spinner';

class Registration extends Component {
	constructor (props) {
		super(props);
		this.state = {
			loading: true,
		};
	}
	componentDidMount () {
		const { containerId, widget } = this.props;

		if (typeof window.Stratum !== 'undefined' && window.Stratum.ApplicationForRegistrations) {
			startRegistrations(containerId, (success) => this.finishedLoading(success));
		} else {
			StratumLoader(containerId, widget, null, (success) => this.finishedLoading(success));
		}
	}
	componentWillUnmount () {
		const { purgeOrphans } = window;
		const { containerId } = this.props;
		if (typeof purgeOrphans !== 'undefined') {
			purgeOrphans(document.getElementById(containerId));
		}
	}
	finishedLoading (success) {
		this.setState({
			loading: false,
		});
	}
	render () {
		const { containerId } = this.props;
		const { loading } = this.state;
		return (
			<div>
				<div className="base-page base-page-full">
					<div id={containerId}>
						{loading && <Spinner />}
					</div>
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
