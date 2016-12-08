import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class NewsItemWidget extends Component {
	render () {
		const { slug, layout } = this.props;
		return <div>NewsItemWidget - slug: {slug}, layout: {layout}</div>;
	}
}
const mapStateToProps = (state) => {
	return { };
};

NewsItemWidget.propTypes = {
	layout: PropTypes.oneOf(['smallImage', 'bigImage']),
	slug: PropTypes.string,
 };

export default connect(mapStateToProps)(NewsItemWidget);
