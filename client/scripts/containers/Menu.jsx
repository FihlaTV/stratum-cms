import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMenuItems } from '../actions/menu';

import { Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { IndexLink } from 'react-router';


class Menu extends Component {
	componentDidMount () {
		const { dispatch } = this.props;
		dispatch(fetchMenuItems());
	}
	formatMenu (menuItems, level = 0) {
		return menuItems.reduce((prev, menuItem, i, arr) => {
			const { url, label, key, items } = menuItem;

			/**
			 * Since bootstrap only supports 2 levels in menues, the structure
			 * should be flat and styled with classes after level 1
			 */
			if (level > 0 && items) {
				return prev.concat(
					this.formatMenu([{ url, label, key, hasChildren: true }], level),
					this.formatMenu(items, level + 1)
				);
			}
			let retVal = prev.concat([
				<LinkContainer to={`/react${url}`} activeClassName="active" key={key}>
					{this.getLinkContents(menuItem, level)}
				</LinkContainer>,
			]);

			/**
			 * Add an extra Menu item for root level menues for displaying
			 * a dropdown in mobile and a single link in desktop
			 */
			if (level === 0 && items) {
				retVal.push(
					<LinkContainer to={`/react${url}`} activeClassName="active" key={`${key}-desktop`}>
						{this.getLinkContents({ url, label, key }, level, true)}
					</LinkContainer>
				);
			}

			return retVal;

		}, []);
	}
	getLinkContents (item, level, desktop = false) {
		const { label, key, items, hasChildren = false } = item;
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
				<NavDropdown className={classNames.join(' ')} title={`${label}`} id={`${key}-dropdown`}>
					{this.formatMenu(items, level + 1)}
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

	render () {
		const { items } = this.props;

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
								{this.formatMenu(items)}
							</Nav>
						</div>
					</div>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

Menu.defaultProps = {
	items: [],
};

Menu.propTypes = { };

const mapStateToProps = (state) => {
	return {
		items: state.menu.items,
	};
};

export default connect(mapStateToProps)(Menu);
