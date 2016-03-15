import React, { Component, PropTypes } from 'react';
import es6Promise from 'es6-promise';
import Spinner from '../components/Spinner';
import fetch from 'isomorphic-fetch';

es6Promise.polyfill();

const style = {
	fontSize: '40px'	
};

class StratumSimpleData extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		this.setState({ loading: true });
		fetch(this.props.url)
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					this.setState({
						data: json.data,
						loading: false
					});
				} else {
					const error = new Error(json.message);
					throw (error);
				}
			})
			.catch(error => {
				this.setState({ loading: false, error: error });
			});
	}
	render() {
		if (this.state.loading) {
			return (
				<Spinner/>
			);
		} else if (this.state.error) {
			return (
				<span>{this.state.error.message}</span>
			);
		}
		return (
			<div>
				<span style={style} className={this.props.indicatorClass}>{this.state.data}</span>
				{this.props.children}
			</div>
		);
	}
}

StratumSimpleData.defaultProps = {
	indicatorClass: 'stratum-widget-indicator'
};

StratumSimpleData.propTypes = {
	url: PropTypes.string.isRequired,
	indicatorClass: PropTypes.string
};

export default StratumSimpleData
