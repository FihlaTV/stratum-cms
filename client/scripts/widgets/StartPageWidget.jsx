import React, { Component } from 'react';
import StratumSimpleData from './StratumSimpleData';

class StartPageWidget extends Component {
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
					url={this.props.url}
					onLoadComplete={this.onComplete.bind(this)}
					className="startpage-widget-digit"
					format={this.props.format}
					root={this.props.root}
					unstyled
				/>
				<span className="startpage-widget-text">
					{this.state.loadComplete && this.props.description}
				</span>
			</div>
		);
	}
}

export default StartPageWidget;
