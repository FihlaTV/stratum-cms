import React, { Component } from 'react';
import StratumWidget from '../components/StratumWidget';
import { setBreadcrumbs, clearBreadcrumbs } from '../actions/breadcrumbs';
import { connect } from 'react-redux';

class Registration extends Component {
	componentWillMount() {
		const { dispatch } = this.props;

		dispatch(
			setBreadcrumbs(
				[{ url: '/registrering', label: 'Registrering' }],
				true,
				'Registrering'
			)
		);
	}
	componentWillUnmount() {
		const { dispatch } = this.props;

		dispatch(clearBreadcrumbs());
	}
	render() {
		return (
			<div>
				<div className="base-page base-page-full">
					<StratumWidget target="sw-registrations" />
				</div>
			</div>
		);
	}
}

export default connect()(Registration);
