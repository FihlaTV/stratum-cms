import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPage } from '../actions/page';
import Spinner from '../components/Spinner';
import { Col, Row } from 'react-bootstrap';
import PrintButton from '../components/PrintButton';
import DockedImages from '../components/DockedImages';

const PageContainer = ({
	loading,
	children,
}) => (
	<Col md={8}>
		<article className="base-page">
			{loading ? <Spinner /> : children}
		</article>
	</Col>
);

class Page extends Component {
	componentDidMount () {
		const { dispatch, params } = this.props;
		const { pageId } = params;
		dispatch(fetchPage(pageId));
	}
	componentWillReceiveProps (nextProps) {
		const { dispatch, params } = this.props;
		const nextPageId = nextProps.params.pageId;

		if (nextPageId && params.pageId !== nextPageId) {
			dispatch(fetchPage(nextPageId));
		}
	}
	render () {
		const {
			page = {},
			loading = true,
		} = this.props;
		const {
			title,
			lead,
			content = {},
			image,
			extraImages = [],
			displayPrintButton,
		} = page;
		return (
			<Row>
				<PageContainer loading={loading}>
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
				<Col md={4}>
					<DockedImages images={extraImages} enlargeable/>
				</Col>
			</Row>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		page: state.page,
		loading: state.page.isLoading,
	};
};

export default connect(mapStateToProps)(Page);
