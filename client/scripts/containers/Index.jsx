import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Spinner from '../components/Spinner';
import { Col, Row } from 'react-bootstrap';
import Jumbotron from '../components/Jumbotron';
import { fetchStartPage } from '../actions/startPage';

class Index extends Component {
	componentDidMount () {
		const { dispatch } = this.props;

		dispatch(fetchStartPage());
	}
	render () {
		const { jumbotron, description = {}, header } = this.props;
		// console.log(startPage);
		return (
			<div>
				<Row>
					<Col md={12}>
						<Jumbotron {...jumbotron} />
					</Col>
				</Row>
				<Row>
					<Col md={7}>
						<div className="base-column brief-info-column">
							<h2>{header}</h2>
							<div dangerouslySetInnerHTML={{ __html: description.html }} />
						</div>
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
