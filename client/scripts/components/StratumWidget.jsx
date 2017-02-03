import React, { Component } from 'react';
import StratumLoader, { startRegistrations, startWidget } from '../utils/stratumLoader';
import Spinner from './Spinner';

const REGISTRATIONS_WIDGET_NAME = 'registrations';

class StratumWidget extends Component {
	constructor (props) {
		super(props);
		this.state = {
			loading: true,
		};
	}
	componentDidMount () {
		const { containerId, widget } = this.props;
		if (typeof window.Stratum !== 'undefined' && widget) {
			if (widget === REGISTRATIONS_WIDGET_NAME && window.Stratum.ApplicationForRegistrations) {
				startRegistrations(containerId, (success) => this.finishedLoading(success));
			} else if (widget !== REGISTRATIONS_WIDGET_NAME) {
				startWidget(containerId, widget);
			}
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
			<div id={containerId}>
				{loading && <Spinner />}
			</div>
		);
	}
}

StratumWidget.defaultProps = {
	registrationId: `registration-script-${(new Date()).getTime()}`,
	containerId: 'sw-registrations',
	widget: REGISTRATIONS_WIDGET_NAME,
};

export default StratumWidget;
