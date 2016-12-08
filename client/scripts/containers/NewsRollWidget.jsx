import React, { Component } from 'react';
import { connect } from 'react-redux';

class NewsRollWidget extends Component {
	render () {
		return <div>NewsRollWidget</div>;
	}
}
const mapStateToProps = (state) => {
	return { };
};

NewsRollWidget.propTypes = { };

export default connect(mapStateToProps)(NewsRollWidget);
