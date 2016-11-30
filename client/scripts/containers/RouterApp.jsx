import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link, IndexLink } from 'react-router';
import Menu from '../components/Menu';
import Breadcrumbs from '../components/Breadcrumbs';
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
			menuItems,
			registerInformation,
			breadcrumbs,
		} = this.props;

		return (
			<div>
				<Menu items={menuItems} />
				<Grid>
					<Breadcrumbs items={breadcrumbs}/>
					{children}
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
		breadcrumbs: state.breadcrumbs.items,
	};
}

export default connect(mapStateToProps)(App);
