import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPage } from '../actions/page';
import Spinner from '../components/Spinner';
import { Col, Row } from 'react-bootstrap';
import PrintButton from '../components/PrintButton';
import DockedImages from '../components/DockedImages';
import ContactPersons from '../components/ContactPersons';
import SubMenu from '../components/SubMenu';

const PageContainer = ({
	loading,
	layout,
	children,
}) => (
	<Col md={layout === 'full' ? 12 : 8}>
		<article className="base-page">
			{loading ? <Spinner /> : children}
		</article>
	</Col>
);

class Page extends Component {
	componentDidMount () {
		const { dispatch, params } = this.props;
		const { pageId } = params;
		if (pageId) {
			dispatch(fetchPage(pageId));
		}
	}
	componentWillReceiveProps (nextProps) {
		const { dispatch, params } = this.props;
		const nextPageId = nextProps.params.pageId;

		if (nextPageId && params.pageId !== nextPageId) {
			dispatch(fetchPage(nextPageId));
		}
		if (nextProps.menuItems.length > 0 && !nextProps.params.pageId) {
			const rePage = this.findFirstPageInMenu(nextProps.params.menu, nextProps.menuItems);
			// Redirect to found page
			this.props.router.push(`/react${rePage.url}`);
		}
	}
	findFirstPageInMenu (menuKey, menuItems) {
		const menuBlock = menuItems.find((item) => item.key === menuKey);
		if (menuBlock && menuBlock.items) {
			return menuBlock.items[0];
		}
		// Throw error instead
		return null;
	}
	findMenuBlock (pageId, menuItems = [], level = 0) {
		if (!pageId) {
			return;
		}
		const matches = menuItems.filter((menuItem) => {
			if (menuItem.items && menuItem.pageKey !== pageId) {
				return this.findMenuBlock(pageId, menuItem.items, level + 1);
			}
			return pageId === menuItem.pageKey;
		});
		if (matches.length > 0) {
			return level === 0 ? matches[0] : true;
		}
		return false;
	}
	render () {
		const {
			page = {},
			menuItems = [],
			loading = true,
		} = this.props;
		const {
			title,
			lead,
			content = {},
			layout,
			image,
			extraImages = [],
			displayPrintButton,
			contacts = [],
			shortId,
		} = page;
		return (
			<Row>
				<PageContainer loading={loading} layout={layout}>
					<header>
						<h1>{title}</h1>
					</header>
					{image && <div className="caption-ct base-page-head-image base-page-head-image-full">
						<img src={image.url} alt={image.description} className="img-response"/>
						{image.description && <div className="caption-text">{image.description}</div>}
					</div>}
					{lead && <p className="lead">
						{lead}
					</p>}
					<div dangerouslySetInnerHTML={{ __html: content.html }} className="post" />
					{displayPrintButton && <PrintButton/>}
				</PageContainer>
				<Col md={layout === 'full' ? 12 : 4}>
					{layout !== 'full' && <SubMenu menuBlock={this.findMenuBlock(shortId, menuItems)} activePageId={shortId} />}
					{contacts.length > 0 && <h2>{contacts.length > 1 ? 'Kontaktpersoner' : 'Kontaktperson'}</h2>}
					<ContactPersons contacts={contacts}/>
					<DockedImages imageSMCols={12} imageMDCols={layout === 'full' ? 6 : 12} images={extraImages} enlargeable/>
				</Col>
			</Row>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		page: state.page,
		loading: state.page.isLoading,
		menuItems: state.menu.items,
	};
};

Page.propTypes = {
	contacts: PropTypes.array,
};

export default connect(mapStateToProps)(Page);
