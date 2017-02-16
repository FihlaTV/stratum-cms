import React, { Component, PropTypes } from 'react';
import StratumLoader, { startRegistrations, startWidget } from '../utils/stratumLoader';
import Spinner from './Spinner';

const REGISTRATIONS_WIDGET_NAME = 'registrations';

function getNonce () {
	return ((new Date()).getTime() + parseInt(Math.random() * 100)).toString(36);
}

class StratumWidget extends Component {
	constructor (props) {
		super(props);
		this.state = {
			loading: true,
		};
	}
	componentWillMount () {
		const { target: _target } = this.props;
		const target = _target || `stratum-widget-${getNonce()}`;

		this.setState({ target });
	}
	componentDidMount () {
		const { target } = this.state;
		const { widget, query } = this.props;
		const queryString = this.formatQuery(query);

		if (typeof window.Stratum !== 'undefined' && widget) {
			this.startWidget({ target, widget, query });
		} else {
			StratumLoader(target, widget, queryString, (success) => this.finishedLoading(success));
		}
	}
	componentWillReceiveProps ({ widget: nWidget, query: nQuery, target: nTarget, id: nId }) {
		const { widget, target, id } = this.props;

		if (widget && nWidget && (nWidget !== widget || nTarget !== target || nId !== id)) {
			this.componentWillUnmount();
			this.setState({ loading: true });
			this.startWidget({ widget: nWidget, query: nQuery, target: this.state.target });
		}
	}
	componentWillUnmount () {
		const { purgeOrphans } = window;
		const { target } = this.state;

		if (typeof purgeOrphans !== 'undefined') {
			purgeOrphans(document.getElementById(target));
		}
	}
	formatQuery (query) {
		const parameters = Object.keys(query).reduce((prev, key, i) => `${prev}${i > 0 ? '&' : ''}${key}=${query[key]}`, '');

		return parameters ? `?${parameters}` : '';
	}
	finishedLoading ({ cancelled, success } = {}) {
		if (!cancelled) {
			this.setState({
				loading: false,
			});
		}
	}
	startWidget ({ target, widget, query }) {
		const queryString = this.formatQuery(query);

		if (widget === REGISTRATIONS_WIDGET_NAME) {
			if (!window.Stratum.ApplicationForRegistrations) {
				StratumLoader(target, widget, queryString, (success) => this.finishedLoading(success));
			} else {
				startRegistrations(target, (success) => this.finishedLoading(success));
			}
		} else if (widget !== REGISTRATIONS_WIDGET_NAME) {
			startWidget(target, widget, queryString, (success) => this.finishedLoading(success));
		}
	}
	render () {
		const { loading, target } = this.state;

		return (
			<div id={target}>
				{loading && <Spinner />}
			</div>
		);
	}
}

StratumWidget.defaultProps = {
	registrationId: `registration-script-${(new Date()).getTime()}`,
	widget: REGISTRATIONS_WIDGET_NAME,
	query: {},
};

StratumWidget.PropTypes = {
	target: PropTypes.string,
	widget: PropTypes.string,
	query: PropTypes.object,
};

export default StratumWidget;
