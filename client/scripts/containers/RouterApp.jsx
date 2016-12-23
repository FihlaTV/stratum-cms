import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link, IndexLink } from 'react-router';
import Menu from '../components/Menu';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import { Grid } from 'react-bootstrap';
import { fetchMenuItems } from '../actions/menu';
import { fetchRegisterInformation } from '../actions/registerInformation';

const MainContainer = ({ hasGrid, children = null }) => {
	if (hasGrid) {
		return (
			<Grid>
				{children}
			</Grid>
		);
	}
	return <div>{children}</div>;
};

class App extends Component {
	constructor (props) {
		super(props);
	}
	componentDidMount () {
		const { dispatch } = this.props;
		dispatch(fetchMenuItems());
		dispatch(fetchRegisterInformation());
	}
	componentWillReceiveProps (nextProps) {
		if (nextProps.error.status && this.props.location.pathname !== '/react/404') {
			this.props.router.push('/react/404');
		}
	}
	render () {
		const {
			children,
			menuItems,
			registerInformation,
			breadcrumbs,
			location,
		} = this.props;

		return (
			<div>
				<Menu items={menuItems} />
				<MainContainer hasGrid={location.pathname !== '/react/'}>
					<Breadcrumbs items={breadcrumbs}/>
					{children}
				</MainContainer>
				<Footer {...registerInformation}/>
			</div>
		);
	}
}

function mapStateToProps (state, { location }) {
	return {
		location,
		menuItems: state.menu.items,
		error: state.error,
		registerInformation: state.registerInformation,
		breadcrumbs: state.breadcrumbs.items,
	};
}

export default connect(mapStateToProps)(App);
