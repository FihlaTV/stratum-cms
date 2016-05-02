import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { } from '../actions/actions';
import { Overlay, Popover } from 'react-bootstrap';

class Context extends Component {
	render() {
		const { 
			dispatch,
			show,
			target,
			error
		} = this.props;
		if(show){
			return (
				<Overlay 
					show={show} 
					target={() => target}
					placement="bottom" >
					<Popover title="Context">
						<strong>Testar lite context</strong>
					</Popover>
				</Overlay>
			);
		}
		return null;
	}
}

function mapDispatchToProps(dispatch){
	return {
	};
}
function mapStateToProps(state){
	return {
		show: state.context.showModal,
		target: state.context.modalTarget
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Context);
