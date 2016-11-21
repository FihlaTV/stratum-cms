import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link, IndexLink } from 'react-router';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { Grid } from 'react-bootstrap';
import { fetchMenuItems } from '../actions/menu';
import { fetchRegisterInformation } from '../actions/registerInformation';

class App extends Component {
	componentDidMount () {
		const { dispatch } = this.props;
		dispatch(fetchMenuItems());
		dispatch(fetchRegisterInformation());
	}
	render () {
		const {
			children,
			location,
			menuItems,
			registerInformation,
		} = this.props;

		return (
			<div>
				<Menu items={menuItems} />
				<Grid>
					{children}
					<p>{location.pathname}</p>
				</Grid>
				<Footer {...registerInformation}/>
			</div>
		);
	}
}

function mapStateToProps (state, { location }) {
	return {
		location,
		menuItems: state.menu.items,
		registerInformation: state.registerInformation,
	};
}

export default connect(mapStateToProps)(App);
