import React, { Component } from 'react';
import widgets from '../widgets/';

class WidgetWrapper extends Component {
	constructor (props) {
		super(props);
		this.state = {};
	}
	render () {
		var Widget = widgets[this.props.id];
		if (!Widget) Widget = widgets.DefaultWidget;
		return Widget ? (
			<Widget {...this.props}>{this.props.children}</Widget>
		) : null;
	}
}

// WidgetWrapper.propTypes = {
// 	id: PropTypes.oneOf(Object.keys(widgets)).isRequired,
// };

export default WidgetWrapper;
