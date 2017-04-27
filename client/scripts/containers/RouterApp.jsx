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
import ScrollButton from '../components/scrollbutton';

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
		if (nextProps.error.status && this.props.location.pathname !== '/404') {
			this.props.router.push('/404');
		}
	}

	render () {
		const {
			children,
			menuItems,
			registerInformation,
			breadcrumbs,
			location,
			show = document.body.scrollHeight > window.innerHeight,
		} = this.props;

		return location.pathname === '/404' ? children : (
			<div className={`stratum-cms-${process.env.CLIENT_THEME || 'default'}`}>
				<Messages id="message-container"/>
				<Menu items={menuItems} tabLayout={process.env.CLIENT_THEME === 'modern'}/>
				<MainContainer hasGrid={location.pathname !== '/'} breadcrumbs={breadcrumbs} id="keystone-main-container">
					{children}
					{show && <ScrollButton/>}
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
