import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setBreadcrumbs, clearBreadcrumbs } from '../actions/breadcrumbs';
import { fetchContactsIfNeeded } from '../actions/contacts';
import { findFirstPageInMenu } from '../utils/menu';
import { Contact } from '../components/ContactPersons';
import GoogleMap from '../components/GoogleMap';

const menuId = 'kontakt';

class Contacts extends Component {
	componentWillMount() {
		const { fetchContactsIfNeeded } = this.props;
		fetchContactsIfNeeded();
	}
	componentDidMount() {
		const { menu = {} } = this.props;
		this.redirectToRegularPage(menu.items);
	}
	componentWillReceiveProps({ menu: nextMenu }) {
		const { menu } = this.props;
		if (nextMenu.items.length >= 1 && menu.items.length === 0) {
			this.redirectToRegularPage(nextMenu.items);
		}
	}
	componentWillUnmount() {
		this.props.clearBreadcrumbs();
	}
	redirectToRegularPage(menuItems) {
		const { router } = this.props;
		const firstPage = findFirstPageInMenu(menuId, menuItems);
		if (firstPage) {
			router.replace(firstPage.url);
		} else {
			this.setBreadcrumbs(menuItems);
		}
	}
	setBreadcrumbs(menuItems) {
		const menuItem = menuItems.find(menuItem => menuItem.key === menuId);
		const label = (menuItem && menuItem.label) || 'Kontakt';

		this.props.setBreadcrumbs([{ url: menuId, label }], true, label);
	}
	renderContacts(columns, contacts = []) {
		let retArr = [];
		for (let i = 0; i < contacts.length / columns; i++) {
			retArr.push(
				<Row key={`contact-list-row-${i}`}>
					{contacts
						.slice(i * columns, (i + 1) * columns)
						.map((props, contactNr) => (
							<Col md={12 / columns} key={`contact-${contactNr}`}>
								<Contact
									imageSize={{ width: 230, height: 160 }}
									{...props}
								/>
							</Col>
						))}
				</Row>
			);
		}
		return retArr;
	}
	render() {
		const {
			title,
			contacts,
			columns,
			registerInformation = {},
		} = this.props;
		const { longitude, latitude, showMap } = registerInformation;

		return (
			<Row>
				<Col md={12}>
					<div className="base-page">
						<h1>{title}</h1>
						{showMap && (
							<GoogleMap lng={longitude} lat={latitude} />
						)}
						<div className="contact-list">
							{this.renderContacts(columns, contacts)}
						</div>
					</div>
				</Col>
			</Row>
		);
	}
}

const mapStateToProps = ({ registerInformation, contacts, menu }) => {
	return {
		loading: contacts.loading,
		contacts: contacts.contacts,
		registerInformation: registerInformation,
		menu,
	};
};
const mapDispatchToProps = dispatch => ({
	fetchContactsIfNeeded: () => dispatch(fetchContactsIfNeeded()),
	setBreadcrumbs: (...args) => dispatch(setBreadcrumbs(...args)),
	clearBreadcrumbs: () => dispatch(clearBreadcrumbs()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Contacts);

Contacts.defaultProps = {
	title: 'Kontakt',
	columns: 3,
};

Contacts.propTypes = {};
