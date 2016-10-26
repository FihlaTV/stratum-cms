import React from 'react';
// import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { IndexLink } from 'react-router';

const menuItems = {
	menuBlocks: [
		{
			url: '/contact',
			label: 'Contact',
			key: 'contact',
		},
		{
			url: '/about',
			label: 'About',
			key: 'about',
		},
		{
			url: '/foer-professionen',
			label: 'För professionen',
			key: 'foer-professionen',
			items: [
				{
					label: 'Frågor och svar',
					key: 'fragor-och-svar',
					url: '/foer-professionen/fragor-och-svar/p/jX3LWMnM',
					pageKey: 'jX3LWMnM',
				},
				{
					url: '/foer-professionen/nyheter-nyhetssida/p/rkx2LW2f',
					label: 'Nyheter',
					key: 'nyheter',
					pageKey: 'rkx2LW2f',
				},
				{
					url: '/about',
					// url: '/foer-professionen/patient/p/rkbhLbhz',
					label: 'Patient',
					key: 'patient',
					pageKey: 'rkbhLbhz',
					items: [
						{
							url: '/foer-professionen/sub-page/p/ryf2UZ2f',
							label: 'Sub Page',
							key: 'sub-page',
							pageKey: 'ryf2UZ2f',
						}, {
							url: '/about/more',
							label: 'Sub Page 2',
							key: 'sub-page2',
							pageKey: 'ryf2UZ2f',
						},
					],
				},
			],
		},
	],
};
function getLinkContents (item, level, desktop = false) {
	const { label, items, hasChildren = false } = item;
	let classNames = level === 2 ? ['sub-sub-nav'] : [];
	if (level === 0) {
		if (desktop) {
			classNames.push('visible-md', 'visible-lg');
		} else if (items) {
			classNames.push('hidden-md', 'hidden-lg');
		}
	}
	if (hasChildren) {
		classNames.push('has-sub-pages');
	}
	if (items) {
		return (
			<NavDropdown className={classNames.join(' ')} title={`${label} - ${level}`}>
				{formatMenu(items, level + 1)}
			</NavDropdown>
		);
	} else {
		return (
			<NavItem className={classNames.join(' ')}>
				{`${label} - ${level}`}
			</NavItem>
		);
	}
}

function formatMenu (menuItems, level = 0) {
	return menuItems.reduce((prev, menuItem, i, arr) => {
		const { url, label, key, items } = menuItem;

		/**
		 * Since bootstrap only supports 2 levels in menues, the structure
		 * should be flat and styled with classes after level 1
		 */
		if (level > 0 && items) {
			return prev.concat(
				formatMenu([{ url, label, key, hasChildren: true }], level),
				formatMenu(items, level + 1)
			);
		}
		let retVal = prev.concat([
			<LinkContainer to={`/react${url}`} activeClassName="active" key={key}>
				{getLinkContents(menuItem, level)}
			</LinkContainer>,
		]);

		/**
		 * Add an extra Menu item for root level menues for displaying
		 * a dropdown in mobile and a single link in desktop
		 */
		if (level === 0 && items) {
			retVal.push(
				<LinkContainer to={`/react${url}`} activeClassName="active" key={`${key}-desktop`}>
					{getLinkContents({ url, label, key }, level, true)}
				</LinkContainer>
			);
		}

		return retVal;

	}, []);
};

const Menu = ({
	items = menuItems,
}) => {
	return (
		<Navbar className="navbar-big" staticTop fluid>
			<div className="navbar-header-container">
				<Navbar.Header>
					<Navbar.Brand>
						<IndexLink to="/react/" activeClassName="active">
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
							<LinkContainer to="/react/about" activeClassName="active">
								<NavItem>About</NavItem>
							</LinkContainer>
							<LinkContainer to="/react/contact" activeClassName="active">
								<NavItem>Contact</NavItem>
							</LinkContainer>
							<LinkContainer to="/react/about" activeClassName="active" className="visible-xs visible-sm">
								<NavDropdown title="Test" expanded>
									<LinkContainer to="/react/about/more" activeClassName="active">
										<MenuItem>Test</MenuItem>
									</LinkContainer>
								</NavDropdown>
							</LinkContainer>
							{formatMenu(menuItems.menuBlocks)}
						</Nav>
					</div>
				</div>
			</Navbar.Collapse>
		</Navbar>
	);

};

Menu.propTypes = { };

export default Menu;
