import React, { PropTypes } from 'react';
import { Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { IndexLink } from 'react-router';
import UserContext from '../containers/App';

function formatMenu (menuItems, level = 0) {
	return menuItems.reduce((prev, menuItem, i, arr) => {
		const { url, label, key, items, state } = menuItem;

		/**
		 * Since bootstrap only supports 2 levels in menues, the structure
		 * should be flat and styled with classes after level 1
		 */
		if (level > 0 && items && items.length > 0) {
			return prev.concat(
				formatMenu([{ url, label, key, hasChildren: true }], level),
				formatMenu(items, level + 1)
			);
		}
		let retVal = prev.concat([
			<LinkContainer to={`${url}`} activeClassName="active" key={key}>
				{getLinkContents(menuItem, level, null)}
			</LinkContainer>,
		]);

		/**
		 * Add an extra Menu item for root level menues for displaying
		 * a dropdown in mobile and a single link in desktop
		 */
		if (level === 0 && items && items.length > 0) {
			retVal.push(
				<LinkContainer to={`${url}`} activeClassName="active" key={`${key}-desktop`}>
					{getLinkContents({ url, label, key, state }, level, true)}
				</LinkContainer>
			);
		}

		return retVal;

	}, []);
}

function getLinkContents (item, level, desktop = false) {
	const { label, key, items, hasChildren = false } = item;
	let classNames = level === 2 ? ['sub-sub-nav'] : [];

	if (level === 0) {
		if (desktop) {
			classNames.push('visible-md', 'visible-lg');
		} else if (items && items.length > 0) {
			classNames.push('hidden-md', 'hidden-lg');
		}
		if (desktop || !items) {
			classNames.push('navbar-main-tab');
		}
	}
	if (hasChildren) {
		classNames.push('has-sub-pages');
	}
	if (items && items.length > 0) {
		return (
			<NavDropdown onClick={(e) => e.preventDefault()} className={classNames.join(' ')} title={`${label}`} id={`${key}-dropdown`}>
				{formatMenu(items, false, level + 1)}
			</NavDropdown>
		);
	} else {
		return (
			<NavItem className={classNames.join(' ')}>
				{`${label}`}
			</NavItem>
		);
	}
}


const Menu = ({
	items,
}) => {
	return (
		<Navbar className="navbar-big navbar-big-tabbed" staticTop fluid>
			<div className="navbar-header-container">
				<Navbar.Header>
					<Navbar.Brand>
						<IndexLink to="/" activeClassName="active">
							<img src="/images/logo_menu_big.png" style={{ display: 'none' }} alt="Registercentrum" className="navbar-brand-image-big" />
							<img src="/images/logo_menu_small.png" alt="Registercentrum" className="navbar-brand-image-small" />
						</IndexLink>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
			</div>
			<Navbar.Collapse>
				<div className="navbar-main">
					<div className="navbar-main-container">
						<Nav pullLeft>
							{formatMenu(items)}
						</Nav>
					</div>
				</div>
				<div className="navbar-upper">
					<UserContext reactRouter/>
				</div>
			</Navbar.Collapse>
		</Navbar>
	);

};

Menu.propTypes = { };

export default Menu;
