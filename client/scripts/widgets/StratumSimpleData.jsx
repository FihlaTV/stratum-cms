import React, { Component, PropTypes } from 'react';
import es6Promise from 'es6-promise';
import Spinner from '../components/Spinner';
import fetch from 'isomorphic-fetch';
import numeral from 'numeral';

// Initialize language for all widgets using format
numeral.language('sv', {
	delimiters: {
		thousands: ' ',
		decimal: ',',
	},
});
numeral.language('sv');

es6Promise.polyfill();

const style = {
	fontSize: '40px',
};

class StratumSimpleData extends Component {
	constructor (props) {
		super(props);
		this.state = {
			loading: true,
		};
	}
	componentDidMount () {
		this.fetchNewData();
	}
	fetchNewData () {
		fetch(this.props.url)
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					this.setState({
						data: this.format(json.data),
						loading: false,
					});
					this.props.onLoadComplete && this.props.onLoadComplete(null);
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => {
				this.setState({ loading: false, error: error });
				this.props.onLoadComplete && this.props.onLoadComplete(error);
			});
	}
	format (val) {
		const format = this.props.format;
		switch (typeof format) {
			case 'function' :
				return format(val);
			case 'string' :
				return numeral(val).format(format);
			default :
				return val;
		}
	}
	render () {
		if (this.state.loading) {
			return (
				<Spinner style={{ margin: '10px auto' }}/>
			);
		} else if (this.state.error) {
			return (
				<span>{this.state.error.message}</span>
			);
		}
		return (
			<div>
				<span style={this.props.unstyled ? {} : style} className={this.props.indicatorClass}>{this.state.data}</span>
				{this.props.children}
			</div>
		);
	}
}

StratumSimpleData.defaultProps = {
	indicatorClass: 'stratum-widget-indicator',
};

StratumSimpleData.propTypes = {
	format: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
	indicatorClass: PropTypes.string,
	onLoadComplete: PropTypes.func,
	onStart: PropTypes.func,
	url: PropTypes.string.isRequired,
};

export default StratumSimpleData;
