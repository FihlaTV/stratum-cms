import React, { Component, PropTypes } from 'react';
import StratumSimpleData from './StratumSimpleData';

class BOAArtrosSkola extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<StratumSimpleData
				url="//stratum.registercentrum.se/api/aggregate/BOA/UnitPraxis/Total/count(UP_UnitName)?APIKey=bK3H9bwaG4o%3D"
			>
				<p>erbjuder artrosskola och har rapporterat till BOA-registret</p>
			</StratumSimpleData>
		);
	}
}

BOAArtrosSkola.defaultProps = {};

export default BOAArtrosSkola
