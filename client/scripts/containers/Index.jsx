import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Spinner from '../components/Spinner';
import { Col, Row } from 'react-bootstrap';
import Jumbotron from '../components/Jumbotron';

class Index extends Component {
	componentDidMount () { }
	render () {
		return (
			<Row>
				<Col md={12}>
					<Jumbotron />
				</Col>
			</Row>
		);
	}
}
const mapStateToProps = (state) => {
	return { };
};

Index.propTypes = { };

export default connect(mapStateToProps)(Index);
