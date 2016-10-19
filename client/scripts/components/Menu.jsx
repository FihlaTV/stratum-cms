import React from 'react';
// import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { IndexLink } from 'react-router';

const Menu = () => {
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
							<LinkContainer to="/react/about" activeClassName="active">
								<NavDropdown title="Test">
									<LinkContainer to="/react/about" activeClassName="active">
										<MenuItem>Test</MenuItem>
									</LinkContainer>
								</NavDropdown>
							</LinkContainer>
						</Nav>
					</div>
				</div>
			</Navbar.Collapse>
		</Navbar>
	);

};

Menu.propTypes = { };

export default Menu;
