import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Spinner from '../components/Spinner';
import { Col, Row } from 'react-bootstrap';
import Jumbotron from '../components/Jumbotron';
import { fetchStartPage } from '../actions/startPage';
import ImageWidget from '../components/ImageWidget';
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
		const Jumbo = <Jumbotron {...jumbotron} widgets={widgets} className={isPortal ? 'jumbotron-portal' : null}/>;
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
				<Row>
					<Col md={12}>
						{Jumbo}
					</Col>
					<Col md={7}>
						{Description}
					</Col>
					<Col md={5}>
						{this.getInformationBlurbComponent(informationBlurb)}
					</Col>
				</Row>
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
