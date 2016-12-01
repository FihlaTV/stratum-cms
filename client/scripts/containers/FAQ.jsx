import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getQuestions } from '../actions/faq';
import { setBreadcrumbs, clearBreadcrumbs } from '../actions/breadcrumbs';
import Questions from '../components/Questions';
import Spinner from '../components/Spinner';

class FAQ extends Component {
	constructor (props) {
		super(props);
	}
	componentDidMount () {
		if (this.props.categoriesArray) {
			this.props.getQuestions(this.props.categoriesArray);
		} else {
			if (this.props.menu.items.length >= 1) {
				this.props.setBreadcrumbs([{ url: 'faq', label: this.props.menu.items.find(obj => obj.key === this.props.route.path).label }]);
			};
			this.props.getQuestions();
		}
	}
	componentWillReceiveProps (nextProps) {
		if (nextProps.menu.items.length >= 1 && this.props.menu.items.length === 0) {
			this.props.setBreadcrumbs([{ url: 'faq', label: nextProps.menu.items.find(obj => obj.key === this.props.route.path).label }]);
		}
	}

	faqContent () {
		return (
			<Row>
				<Col md={8} >
					<div className="base-page">
						<h1>Frågor och svar</h1>
						<Questions faqArr={this.props.faq.questions} />
					</div>
				</Col>
			</Row>
		);
	}
	pageContent () {
		return <Questions faqArr={this.props.faq.questions} />;
	}
	content () {
		return this.props.categoriesArray ? this.pageContent() : this.faqContent();
	}
	render () {
		return this.props.faq.loading ? <Spinner /> : this.content();
	}
}

const mapStateToProps = ({ faq, menu }) => {
	return { faq, menu };
};
const mapDispatchToProps = (dispatch) => ({
	getQuestions: () => dispatch(getQuestions()),
	setBreadcrumbs: (bcArr) => dispatch(setBreadcrumbs(bcArr)),
	clearBreadcrumbs: () => dispatch(clearBreadcrumbs()),
});
export default connect(mapStateToProps, mapDispatchToProps)(FAQ);
