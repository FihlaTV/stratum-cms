import React, { Component, PropTypes } from 'react';
import widgets from '../widgets/';

class WidgetWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const Widget = widgets[this.props.id];
		return (
			<Widget {...this.props}>{this.props.children}</Widget>
		);
	}
}

WidgetWrapper.propTypes = {
	id: PropTypes.oneOf(Object.keys(widgets)).isRequired
};

export default WidgetWrapper
