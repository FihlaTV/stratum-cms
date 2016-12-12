import React, { Component, PropTypes } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getQuestions } from '../actions/faq';
import { setBreadcrumbs, clearBreadcrumbs } from '../actions/breadcrumbs';
import Questions from '../components/Questions';
import Spinner from '../components/Spinner';

const FAQContainer = ({
	title,
	children,
}) => (
	<Row>
		<Col md={8} >
			<div className="base-page">
				<h1>{title}</h1>
				{children}
			</div>
		</Col>
	</Row>
);

class FAQ extends Component {
	componentDidMount () {
		const { categories, menu, getQuestions, route } = this.props;
		if (menu.items.length >= 1 && !categories) {
			this.setBreadcrumbs(menu.items, route.path);
		}
		getQuestions(categories);
	}
	componentWillReceiveProps ({ menu: nextMenu }) {
		const { menu, categories, route } = this.props;
		if (nextMenu.items.length >= 1 && menu.items.length === 0 && !categories) {
			this.setBreadcrumbs(nextMenu.items, route.path);
		}
	}
	setBreadcrumbs (menuItems, routePath) {
		const label = menuItems.find(menuItem => menuItem.key === routePath).label;

		this.props.setBreadcrumbs([{ url: 'faq', label }]);
	}
	render () {
		const { loading, questions, title, categories } = this.props;

		if (loading) {
			return <Spinner />;
		}
		if (categories) {
			return <Questions faqArr={questions} />;
		}
		return <FAQContainer title={title}><Questions faqArr={questions} /></FAQContainer>;
	}
}

const mapStateToProps = ({ faq, menu }) => {
	return {
		loading: faq.loading,
		menu,
		questions: faq.questions,
	};
};
const mapDispatchToProps = (dispatch) => ({
	setBreadcrumbs: (breadcrumbs) => dispatch(setBreadcrumbs(breadcrumbs)),
	getQuestions: (categories) => dispatch(getQuestions(categories)),
	clearBreadcrumbs: () => dispatch(clearBreadcrumbs()),
});
export default connect(mapStateToProps, mapDispatchToProps)(FAQ);

FAQ.defaultProps = {
	title: 'Frågor och svar',
};

FAQ.propTypes = {
	categories: PropTypes.arrayOf(PropTypes.string),
	title: PropTypes.string,
};
