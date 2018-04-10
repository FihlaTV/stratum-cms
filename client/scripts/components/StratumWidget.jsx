import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StratumLoader, {
	startRegistrations,
	startWidget,
} from '../utils/stratumLoader';
import Spinner from './Spinner';

const REGISTRATIONS_WIDGET_NAME = 'registrations';

function getNonce() {
	return (new Date().getTime() + parseInt(Math.random() * 100)).toString(36);
}

class StratumWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};
	}
	componentWillMount() {
		const { target: _target } = this.props;
		const target = _target || `stratum-widget-${getNonce()}`;

		this.setState({ target });
	}
	componentDidMount() {
		const { target } = this.state;
		const { widget, query, advancedSettings } = this.props;
		const queryString = this.formatQuery(query);

		if (typeof window.Stratum !== 'undefined' && widget) {
			this.startWidget({ target, widget, query, advancedSettings });
		} else {
			this.evalAdvancedSettings(advancedSettings);
			StratumLoader(target, widget, queryString, success =>
				this.finishedLoading(success)
			);
		}
	}
	componentWillReceiveProps({
		widget: nWidget,
		query: nQuery,
		target: nTarget,
		id: nId,
		advancedSettings,
	}) {
		const { widget, target, id } = this.props;

		if (
			widget &&
			nWidget &&
			(nWidget !== widget || nTarget !== target || nId !== id)
		) {
			this.componentWillUnmount();
			this.setState({ loading: true });
			this.startWidget({
				widget: nWidget,
				query: nQuery,
				target: this.state.target,
				advancedSettings,
			});
		}
	}
	componentWillUnmount() {
		const { purgeOrphans } = window;
		const { target } = this.state;

		if (typeof purgeOrphans !== 'undefined') {
			purgeOrphans(document.getElementById(target));
		}
	}
	formatQuery(query) {
		const parameters = Object.keys(query).reduce(
			(prev, key, i) => `${prev}${i > 0 ? '&' : ''}${key}=${query[key]}`,
			''
		);

		return parameters ? `?${parameters}` : '';
	}
	finishedLoading({ cancelled, success } = {}) {
		if (!cancelled) {
			this.setState({
				loading: false,
			});
		}
	}
	// TODO: Would be nice to disallow the use of injecting javascript from backend.
	evalAdvancedSettings(advancedSettings) {
		if (!advancedSettings) {
			return;
		}
		try {
			// eslint-disable-next-line no-eval
			eval(advancedSettings);
		} catch (err) {
			console.log('Error loading advanced settings', err);
		}
	}
	startWidget({ target, widget, query, advancedSettings }) {
		const queryString = this.formatQuery(query);

		if (widget === REGISTRATIONS_WIDGET_NAME) {
			if (!window.Stratum.ApplicationForRegistrations) {
				StratumLoader(target, widget, queryString, success =>
					this.finishedLoading(success)
				);
			} else {
				startRegistrations(target, success =>
					this.finishedLoading(success)
				);
			}
		} else if (widget !== REGISTRATIONS_WIDGET_NAME) {
			this.evalAdvancedSettings(advancedSettings);
			startWidget(target, widget, queryString, success =>
				this.finishedLoading(success)
			);
		}
	}
	render() {
		const { loading, target } = this.state;

		return <div id={target}>{loading && <Spinner />}</div>;
	}
}

StratumWidget.defaultProps = {
	registrationId: `registration-script-${new Date().getTime()}`,
	widget: REGISTRATIONS_WIDGET_NAME,
	query: {},
};

StratumWidget.PropTypes = {
	target: PropTypes.string,
	widget: PropTypes.string,
	query: PropTypes.object,
	advancedSettings: PropTypes.string,
};

export default StratumWidget;
