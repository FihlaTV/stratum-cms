import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getQuestions } from '../actions/faq';
import Questions from '../components/Questions';
import Spinner from '../components/Spinner';

class FAQ extends Component {
	constructor (props) {
		super(props);
	}
	componentDidMount () {
		this.props.getQuestions();
	}

	content () {
		return (
			<div className="base-page">
				<h1>Frågor och svar</h1>
				<Questions faqArr={this.props.faq.questions} />
			</div>
		);
	}
	render () {
		return this.props.faq.loading ? <Spinner /> : this.content();
	}
}

const mapStateToProps = ({ faq }) => {
	return { faq };
};
const mapDispatchToProps = (dispatch) => ({
	getQuestions: () => dispatch(getQuestions()),
});
export default connect(mapStateToProps, mapDispatchToProps)(FAQ);
