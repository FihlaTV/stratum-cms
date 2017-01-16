import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPage } from '../actions/page';
import { setBreadcrumbs, clearBreadcrumbs } from '../actions/breadcrumbs';
import { clearPage } from '../actions/page';
import Spinner from '../components/Spinner';
import { Col, Row } from 'react-bootstrap';
import PrintButton from '../components/PrintButton';
import DockedImages from '../components/DockedImages';
import ContactPersons from '../components/ContactPersons';
import SubMenu from '../components/SubMenu';
import FAQ from './FAQ';
import ResourceList from '../components/ResourceList';
import WidgetWrapper from '../components/WidgetWrapper';

const SideArea = ({
	title,
	content = {},
}) => (
	<div className="side-area">
		<h2>{title}</h2>
		<div dangerouslySetInnerHTML={{ __html: content.html }} />
	</div>
);

const WidgetContainer = ({
	widget,
}) => {
	if (!widget) {
		return null;
	}
	const { title, name, description, ...widgetProps } = widget;
	return (
		<div className="side-area">
			<h2>{title}</h2>
			<p>{description}</p>
			<WidgetWrapper id={name} {...widgetProps}/>
		</div>
	);
};

const PageContainer = ({
	loading,
	children,
}) => (
	<article className="base-page">
		{loading ? <Spinner /> : children}
	</article>
);

class Page extends Component {
	componentDidMount () {
		const { dispatch, params, menuItems } = this.props;
		const { pageId, menu } = params;
		if (pageId) {
			dispatch(fetchPage(pageId));
		} else if (menu && menuItems.length > 0) {
			this.redirectFromMenu(menu, menuItems);
		}
	}
	componentWillReceiveProps (nextProps) {
		const { dispatch, params, page, menuItems } = this.props;
		const nextPageId = nextProps.params.pageId;
		const nextPage = nextProps.page;

		if (nextPageId && params.pageId !== nextPageId) {
			dispatch(fetchPage(nextPageId));
		}
		if (nextPage && nextPage !== page || nextProps.menuItem !== menuItems) {
			const currentMenu = nextProps.menuItems.find((menu) => menu.key === nextProps.params.menu);
			if (currentMenu && nextPage) {
				this.setBreadcrumbs(currentMenu, nextPage);
			}
		}
		if (nextProps.menuItems.length > 0 && !nextProps.params.pageId) {
			this.redirectFromMenu(nextProps.params.menu, nextProps.menuItems);
		}
	}
	componentWillUnmount () {
		const { dispatch } = this.props;
		dispatch(clearBreadcrumbs());
		dispatch(clearPage());
	}
	redirectFromMenu (menuSlug, menuItems) {
		const rePage = this.findFirstPageInMenu(menuSlug, menuItems);
		// Redirect to found page
		this.props.router.push(`/react${rePage.url}`);
	}
	getPageUrl (menu, page, parentPage) {
		const { slug, shortId } = page;
		const parentUrl = parentPage ? `${parentPage.slug}/` : '';

		return `${menu}/${parentUrl}${slug}/p/${shortId}`;
	}
	setBreadcrumbs (menu, page) {
		const { dispatch } = this.props;
		const { parentPage, title } = page;
		let breadcrumbs = [];

		breadcrumbs.push({ url: `${menu.key}`, label: menu.label });
		if (parentPage) {
			breadcrumbs.push({ url: this.getPageUrl(menu.key, parentPage), label: parentPage.title });
		}
		breadcrumbs.push({ url: this.getPageUrl(menu.key, page, parentPage), label: title });

		dispatch(setBreadcrumbs(breadcrumbs));
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
		return undefined;
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
			questionCategories = [],
			resources = [],
			resourcePlacement,
			sideArea,
			widget,
		} = page;
		return (
			<Row>
				<Col md={layout === 'full' ? 12 : 8}>
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
						{questionCategories.length > 0 && <FAQ categories={questionCategories}/>}
					</PageContainer>
					{resources.length > 0 && resourcePlacement === 'left' && <ResourceList resources={resources} container/>}
				</Col>
				<Col md={layout === 'full' ? 12 : 4}>
					{layout !== 'full' && <SubMenu menuBlock={this.findMenuBlock(shortId, menuItems)} activePageId={shortId} />}
					{widget && <WidgetContainer widget={widget}/>}
					{sideArea && <SideArea {...sideArea} />}
					{contacts.length > 0 && <h2>{contacts.length > 1 ? 'Kontaktpersoner' : 'Kontaktperson'}</h2>}
					<ContactPersons contacts={contacts}/>
					<DockedImages imageSMCols={12} imageMDCols={layout === 'full' ? 6 : 12} images={extraImages} enlargeable/>
					{resources.length > 0 && resourcePlacement !== 'left' && <ResourceList resources={resources} container/>}
				</Col>
			</Row>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		page: state.page.currentPage,
		loading: state.page.isLoading,
		menuItems: state.menu.items,
	};
};

Page.propTypes = {
	contacts: PropTypes.array,
};

export default connect(mapStateToProps)(Page);
