import React, { Component, PropTypes } from 'react';
import es6Promise from 'es6-promise';
import Spinner from '../components/Spinner';
import fetch from 'isomorphic-fetch';

es6Promise.polyfill();

class BOAArtrosSkola extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		this.setState({ loading: true });
		fetch('//stratum.registercentrum.se/api/aggregate/BOA/UnitPraxis/Total/count(UP_UnitName)?APIKey=bK3H9bwaG4o%3D')
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
				<div>
					{this.state.error.message}
				</div>
			)
		}
		return (
			<div>
				<h2>{this.state.data}</h2>
				<p>erbjuder artrosskola och har rapporterat till BOA-registret</p>
			</div>
		);
	}
}

BOAArtrosSkola.defaultProps = {};

export default BOAArtrosSkola
