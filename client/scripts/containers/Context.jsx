import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchContexts, changeRole, setUnit } from '../actions/context';
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
			currentRole,
			currentUnit,
			units,
			error
		} = this.props;
		return (
			<Overlay 
				show={show} 
				target={() => target}
				placement="bottom" >
				<Popover title="Byt enhet och/eller roll" id="context-popover">
					<UnitList 
						units={units.map(u => ({name: u.UnitName, id: u.UnitID}))}
						roles={roles.map(r => ({name: r.RoleName, id: r.RoleID}))}
						roleChange={x => dispatch(changeRole(x))}
						unitChange={x => dispatch(setUnit(x))}
						currentRole={currentRole}
						currentUnit={currentUnit}
					/>
					<Button bsStyle="primary" block>Genomför</Button>
					<Button block>Logga ut</Button>
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
		roles: state.context.roles,
		units: state.context.units,
		currentRole: state.context.currentRole,
		currentUnit: state.context.currentUnit
	};
}

export default connect(mapStateToProps)(Context);
