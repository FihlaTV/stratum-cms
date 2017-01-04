import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Spinner from '../components/Spinner';
import { Col, Row, Grid } from 'react-bootstrap';
import Jumbotron from '../components/Jumbotron';
import { fetchStartPage } from '../actions/startPage';
import ImageWidget from '../components/ImageWidget';
import InternalLink from '../components/InternalLink';
import NewsRollWidget from './NewsRollWidget';
import NewsItemWidget from './NewsItemWidget';
import PageLink from './PageLink';

const SubRegisterList = ({ subRegisters = [] }) =>
(
	<div className="sub-registers sub-registers-simple">
		<ul>
			{subRegisters.map(({ name, url }, i) => (
				<li key={`subregister-${i}`}>
					<a href={url}>{name}</a>
				</li>
			))}
		</ul>
	</div>
);

const InternalLinks = ({ internalLinks = [] }) =>
{
	if (internalLinks) {
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
	componentDidMount () {
		const { dispatch } = this.props;

		dispatch(fetchStartPage());
	}
	getInformationBlurbComponent (informationBlurb) {
		const { type: ibType } = informationBlurb;
		switch (ibType) {
			case 'newsItem':
				return <NewsItemWidget slug={informationBlurb.newsItem.slug} layout={informationBlurb.newsItemLayout} />;
			case 'newsRoll':
				return <NewsRollWidget />;
			case 'image':
				return <ImageWidget {...informationBlurb.image}/>;
			default:
				return null;
		}
	}
	render () {
		const {
			jumbotron,
			description = {},
			header,
			internalLinks = [],
			widgets,
			isPortal,
			informationBlurb = {},
			subRegisters = [],
			quickLink,
		} = this.props;
		let descriptionClassNames = ['base-column', 'brief-info-column'];
		if (informationBlurb.type === 'image') {
			descriptionClassNames.push('startpage-description-height');
		}
		const Jumbo = jumbotron ? <Jumbotron {...jumbotron} widgets={widgets} portal={isPortal}/> : null;
		const Description = (
			<div className={descriptionClassNames.join(' ')}>
				<h2>{header}</h2>
				<div dangerouslySetInnerHTML={{ __html: description.html }} />
			</div>
		);
		if (isPortal) {
			return (
				<div>
					<Col md={7}>
						{Jumbo}
						{Description}
					</Col>
					<Col md={5}>
						<h2>Delregister</h2>
						<SubRegisterList subRegisters={subRegisters} />
						{this.getInformationBlurbComponent(informationBlurb)}
						{quickLink && <PageLink pageId={quickLink.page.shortId} className="startpage-portal-link">{quickLink.text}</PageLink>}
					</Col>
				</div>
			);
		}
		return (
			<div>
				{jumbotron && jumbotron.type === 'wide' ? Jumbo : <Grid>{Jumbo}</Grid>}
				<Grid>
					<InternalLinks internalLinks={internalLinks} />
					<Row>
						<Col md={7}>
							{Description}
						</Col>
						<Col md={5}>
							{this.getInformationBlurbComponent(informationBlurb)}
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		...state.startPage,
	};
};

Index.propTypes = { };

export default connect(mapStateToProps)(Index);
