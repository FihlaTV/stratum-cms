import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Spinner from '../components/Spinner';
import { Col, Row, Grid } from 'react-bootstrap';
import JumbotronInner from '../components/Jumbotron';
import { fetchStartPage } from '../actions/startPage';
import ImageWidget from '../components/ImageWidget';
import InternalLink from '../components/InternalLink';
import NewsRollWidget from './NewsRollWidget';
import NewsItemWidget from './NewsItemWidget';
import PageLink from './PageLink';

const isModernTheme = process.env.CLIENT_THEME === 'modern';

const SubRegisterList = ({ subRegisters = [] }) => (
	<div
		className={`sub-registers sub-registers-${
			isModernTheme ? 'modern' : 'simple'
		}`}
	>
		<ul>
			{subRegisters.map(({ name, url }, i) => (
				<li key={`subregister-${i}`}>
					<a href={url}>{name}</a>
				</li>
			))}
		</ul>
	</div>
);

const InternalLinks = ({ internalLinks = [] }) => {
	if (internalLinks.length > 0) {
		const cols = Math.min(internalLinks.length, 4);
		return (
			<Row>
				{internalLinks.map((link, i) => (
					<Col md={12 / cols} key={`internal-link-${i}`}>
						<InternalLink {...link} />
					</Col>
				))}
			</Row>
		);
	}
	return null;
};

class Index extends Component {
	componentDidMount() {
		const { dispatch } = this.props;

		dispatch(fetchStartPage());
	}
	getInformationBlurbComponent(informationBlurb) {
		const { type: ibType } = informationBlurb;
		switch (ibType) {
			case 'newsItem':
				return (
					<NewsItemWidget
						slug={informationBlurb.newsItem.slug}
						layout={informationBlurb.newsItemLayout}
					/>
				);
			case 'newsRoll':
				return <NewsRollWidget />;
			case 'image':
				return <ImageWidget {...informationBlurb.image} />;
			default:
				return null;
		}
	}
	render() {
		const {
			jumbotron,
			description = {},
			header,
			internalLinks = [],
			widgets,
			isPortal,
			informationBlurb = {},
			subRegisters = [],
			subRegisterTitle = 'Delregister',
			quickLink,
		} = this.props;
		let descriptionClassNames = ['base-column', 'brief-info-column'];
		if (informationBlurb.type === 'image') {
			descriptionClassNames.push('startpage-description-height');
		}
		const Jumbotron = jumbotron ? (
			<JumbotronInner
				{...jumbotron}
				widgets={widgets}
				portal={isPortal}
			/>
		) : null;

		const Description =
			description.html && header ? (
				<div className={descriptionClassNames.join(' ')}>
					<h2>{header}</h2>
					<div
						dangerouslySetInnerHTML={{ __html: description.html }}
					/>
				</div>
			) : null;

		return (
			<div>
				{jumbotron && jumbotron.type === 'wide' ? (
					Jumbotron
				) : (
					<Grid>{Jumbotron}</Grid>
				)}
				<Grid>
					<InternalLinks internalLinks={internalLinks} />
					{internalLinks.length > 0 && <hr className="hr-block" />}
					<Row>
						<Col md={7}>
							{Description}
							{isPortal && (
								<div>
									<h2>{subRegisterTitle}</h2>
									<SubRegisterList
										subRegisters={subRegisters}
									/>
								</div>
							)}
						</Col>
						<Col md={5}>
							{this.getInformationBlurbComponent(
								informationBlurb
							)}
							{isPortal &&
								quickLink &&
								quickLink.page && (
									<PageLink
										pageId={quickLink.page.shortId}
										className="startpage-portal-link"
									>
										{quickLink.text}
									</PageLink>
								)}
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
}
const mapStateToProps = state => {
	return {
		...state.startPage,
	};
};

Index.propTypes = {};

export default connect(mapStateToProps)(Index);
