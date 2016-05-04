import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchContexts } from '../actions/context';
import { Overlay, Popover, Button } from 'react-bootstrap';
import UnitList from '../components/UnitList.jsx';

class Context extends Component {
	componentDidMount() {
		const { dispatch } = this.props;
		
		// debugger;
		// Do fetch of units...
		dispatch(fetchContexts());
	}
	render() {
		const { 
			dispatch,
			show,
			roles = [],
			target,
			error
		} = this.props;
		return (
			<Overlay 
				show={show} 
				target={() => target}
				placement="bottom" >
				<Popover title="Byt enhet och/eller roll" id="context-popover">
					<UnitList 
						units={
							[{
								name: 'Unit 1', 
								id: 1
							},{
								name: 'Unit 2', 
								id: 2
							}]}
						roles={roles.map(r => { return {name: r.RoleName, id: r.RoleId};})}
					/>
					<Button bsStyle="primary" block>Logga ut</Button>
				</Popover>
			</Overlay>
		);
	}
}

Context.propTypes = {
    dispatch: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch){
	return {
	};
}
function mapStateToProps(state){
	return {
		show: state.context.showModal,
		target: state.context.modalTarget,
		roles: state.context.roles
	};
}

export default connect(mapStateToProps)(Context);
