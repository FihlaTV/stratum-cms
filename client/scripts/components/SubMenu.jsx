import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function renderLink (menuItem) {
	const { key, url, label, items = [] } = menuItem;
	const cls = items.length > 0 ? 'has-sub-pages expanded' : '';
	const Link = (
		<LinkContainer key={key} to={`/react${url}`} activeClassName="active" className={cls}>
			<NavItem>{label}</NavItem>
		</LinkContainer>
	);

	return items ? [Link, <SubNav containsSubPages key={`sub-nav-${key}`} menuItems={items}/>] : Link;
}

const SubNav = ({
	menuItems = [],
	containsSubPages = false,
}) => {
	const cls = containsSubPages ? 'nav-page-second' : 'nav-page';
	return (
		<Nav bsStyle="pills" className={cls} stacked>
			{menuItems.map(renderLink)}
		</Nav>
	);
};

const SubMenu = ({
	menuBlock = {},
}) => {
	const { items = [] } = menuBlock;
	return (
		<div className="sub-menu">
			<SubNav menuItems={items} />
		</div>
	);

};

SubMenu.propTypes = { };

export default SubMenu;
