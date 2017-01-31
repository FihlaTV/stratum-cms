import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link, IndexLink } from 'react-router';
import Menu from '../components/Menu';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import { Grid } from 'react-bootstrap';
import { fetchMenuItems } from '../actions/menu';
import { fetchRegisterInformation } from '../actions/registerInformation';
import Messages from './Messages';

const MainContainer = ({ hasGrid, children = null, breadcrumbs, ...props }) => {
	if (hasGrid) {
		return (
			<Grid {...props} >
				{breadcrumbs && <Breadcrumbs items={breadcrumbs}/>}
				{children}
			</Grid>
		);
	}
	return <div {...props}>{children}</div>;
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
			<div className={`stratum-cms-${process.env.CLIENT_THEME || 'default'}`}>
				<Messages id="message-container"/>
				<Menu items={menuItems} tabLayout={process.env.CLIENT_THEME === 'modern'}/>
				<MainContainer hasGrid={location.pathname !== '/react/'} breadcrumbs={breadcrumbs} id="keystone-main-container">
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
