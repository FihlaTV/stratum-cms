import React, { Component } from 'react';
import StratumSimpleData from './StratumSimpleData';

class BOAAndel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loadComplete: false,
		};
	}
	onComplete(error) {
		this.setState({
			error: error,
			loadComplete: true,
		});
	}
	render() {
		return (
			<div>
				<StratumSimpleData
					url="/stratum/api/aggregate/BOA/FirstVisitPatient/Total/count?APIKey=bK3H9bwaG4o%3D"
					onLoadComplete={this.onComplete.bind(this)}
					unstyled
				/>
				<p>{this.state.loadComplete && this.props.description}</p>
			</div>
		);
	}
}

export default BOAAndel;
