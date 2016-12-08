import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Spinner from '../components/Spinner';
import { Col, Row } from 'react-bootstrap';
import Jumbotron from '../components/Jumbotron';
import { fetchStartPage } from '../actions/startPage';
import ImageWidget from '../components/ImageWidget';
import NewsRollWidget from './NewsRollWidget';
import NewsItemWidget from './NewsItemWidget';

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
			informationBlurb = {},
		} = this.props;
		let descriptionClassNames = ['base-column', 'brief-info-column'];
		if (informationBlurb.type === 'image') {
			descriptionClassNames.push('startpage-description-height');
		}
		return (
			<div>
				<Row>
					<Col md={12}>
						<Jumbotron {...jumbotron} widgets={widgets} />
					</Col>
				</Row>
				<Row>
					<Col md={7}>
						<div className={descriptionClassNames.join(' ')}>
							<h2>{header}</h2>
							<div dangerouslySetInnerHTML={{ __html: description.html }} />
						</div>
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
