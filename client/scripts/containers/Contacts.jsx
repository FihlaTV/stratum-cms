import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setBreadcrumbs, clearBreadcrumbs } from '../actions/breadcrumbs';
import { fetchContactsIfNeeded } from '../actions/contacts';
import { findFirstPageInMenu } from '../utils/menu';

const menuId = 'kontakt';

const Contact = ({ name, image, email, phone, title, note, columns }) => (
	<div className="contact-list-item">
		{image && <img src={image.url} className="contact-list-image" />}
		<h3>
			{name.first} {name.last}
		</h3>
		{title && <p className="contact-list-title">{title}</p>}
		{note && <p className="contact-list-note">{note}</p>}
		{phone && (
			<p>
				<strong>Telefon: </strong>
				{phone}
			</p>
		)}
		{email && (
			<p>
				<strong>E-post: </strong>
				<a href={`mailto:${email}`}>{email}</a>
			</p>
		)}
	</div>
);

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
	renderContacts(columns = 3, contacts = []) {
		let retArr = [];
		for (let i = 0; i < contacts.length / 3; i++) {
			retArr.push(
				<Row key={`contact-list-row-${i}`}>
					{contacts
						.slice(i * columns, (i + 1) * columns)
						.map((props, contactNr) => (
							<Col md={12 / columns} key={`contact-${contactNr}`}>
								<Contact {...props} />
							</Col>
						))}
				</Row>
			);
		}
		return retArr;
	}
	render() {
		const { title, contacts, columns } = this.props;
		return (
			<Row>
				<Col md={12}>
					<div className="base-page">
						<h1>{title}</h1>
						<div className="contact-list">
							{this.renderContacts(columns, contacts)}
						</div>
					</div>
				</Col>
			</Row>
		);
	}
}

const mapStateToProps = ({ contacts, menu }) => {
	return {
		loading: contacts.loading,
		contacts: contacts.contacts,
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
	columns: 2,
};

Contacts.propTypes = {};
