import React, { Component } from 'react';
import { Col, Row, Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setBreadcrumbs, clearBreadcrumbs } from '../actions/breadcrumbs';
import { fetchContactsIfNeeded } from '../actions/contacts';
import { findFirstPageInMenu } from '../utils/menu';
import Contact from '../components/Contact';
import GoogleMap from '../components/GoogleMap';

const menuId = 'kontakt';

const ContactInformation = ({
	name,
	location,
	phone,
	fax,
	email,
	locationInformation,
}) => {
	const { street1, street2, zipCode, city } = location;

	return (
		<div className="contact-location-info">
			<h2>{name}</h2>
			<p>
				Telefon: {phone}
				<br />
				Fax: {fax}
				<br />
				<a href={`mailto:${email}`}>{email}</a>
				<br />
			</p>
			<p>
				{street1}
				<br />
				{street2}
				{street2 && <br />}
				{zipCode} {city}
			</p>
			<div dangerouslySetInnerHTML={{ __html: locationInformation }} />
		</div>
	);
};

const ContactList = ({
	columns,
	hideImages,
	contacts = [],
	containerClass = '',
}) => {
	const className = 'contact-list';
	let retArr = [];
	// Chunk contacts
	for (let i = 0; i < contacts.length / columns; i++) {
		retArr.push(
			contacts
				.slice(i * columns, (i + 1) * columns)
				.map((props, contactNr) => (
					<Col md={12 / columns} key={`contact-${contactNr}`}>
						<Contact
							imageSize={{ width: 230, height: 160 }}
							{...props}
							hideImage={hideImages}
						/>
					</Col>
				))
		);
	}
	return (
		<div className={`${className} ${containerClass}`}>
			{retArr.map((x, i) => <Row key={`contact-list-row-${i}`}>{x}</Row>)}
		</div>
	);
};

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
	render() {
		const {
			title,
			contacts,
			columns,
			registerInformation = {},
		} = this.props;
		const {
			longitude,
			latitude,
			showMap,
			locationImage,
			selectedContacts = [],
			contactGroups = [],
			leadText,
		} = registerInformation;

		return (
			<Row>
				<Col md={12} className="contact-page">
					<h1>{title}</h1>
					<Row>
						<Col lg={10}>
							<p className="lead">{leadText}</p>
						</Col>
					</Row>
					{showMap ? (
						<Row className="contact-location">
							<Col md={7} className="contact-location-map">
								<GoogleMap lng={longitude} lat={latitude} />
							</Col>
							<Col md={5}>
								<ContactInformation {...registerInformation} />
							</Col>
						</Row>
					) : (
						<Row className="contact-location">
							{locationImage && (
								<Col md={7} className="contact-location-image">
									<Image
										responsive
										src={locationImage.url}
										alt={locationImage.description}
									/>
								</Col>
							)}
							<Col md={5}>
								<ContactInformation {...registerInformation} />
							</Col>
						</Row>
					)}
					<ContactList
						columns={columns}
						contacts={selectedContacts
							.map(sId => contacts.find(({ id }) => id === sId))
							.filter(c => !!c)}
						containerClass="contact-list-selected"
					/>
					<div>
						{contactGroups.map(({ group, id: groupId }) => {
							return (
								<div
									className="contact-group"
									key={`contact-group-${groupId}`}
								>
									<h2>{group}</h2>
									<ContactList
										columns={columns}
										contacts={contacts.filter(
											({ groups }) =>
												groups.some(
													({ id }) => id === groupId
												)
										)}
										hideImages
									/>
								</div>
							);
						})}
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
