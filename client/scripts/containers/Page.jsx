import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPage } from '../actions/page';
import Spinner from '../components/Spinner';
import { Col } from 'react-bootstrap';

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
			imageDescription,
		} = page;
		return (
			<PageContainer loading={loading}>
				<header>
					<h1>{title}</h1>
				</header>
				{image && <div className="caption-ct base-page-head-image base-page-head-image-full">
					<img src={image.url} alt={imageDescription} className="img-response"/>
					{imageDescription && <div className="caption-text">{imageDescription}</div>}
				</div>}
				{lead && <p className="lead">
					{lead}
				</p>}
				<div dangerouslySetInnerHTML={{ __html: content.html }} className="post" />
			</PageContainer>
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
