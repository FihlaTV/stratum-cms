import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchContexts, changeRole, unitChange, syncContext } from '../actions/context';
import { Overlay, Popover, Button } from 'react-bootstrap';
import UnitList from '../components/UnitList';
import ContextSyncButton from '../components/ContextSyncButton';

class Context extends Component {
	componentDidMount() {
		const { dispatch } = this.props;
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
			currentContext,
			isDirty,
			units,
			isSyncing,
			error
		} = this.props;
		return (
			<Overlay 
				show={show} 
				target={() => target}
				placement="bottom" >
				<Popover title="Byt enhet och/eller roll" id="context-popover">
					<UnitList 
						units={units.map(u => ({name: u.UnitName, id: u.UnitID, code: u.UnitCode}))}
						roles={roles.map(r => ({name: r.RoleName, id: r.RoleID}))}
						roleChange={x => dispatch(changeRole(x))}
						unitChange={x => dispatch(unitChange(x))}
						currentRole={currentRole}
						currentUnit={currentUnit}
						contextId={currentContext && currentContext.ContextID}
					/>
					<ContextSyncButton bsStyle="primary" block disabled={!currentContext || !isDirty} isSyncing={isSyncing} onClick={() => {
						dispatch(syncContext(currentContext.ContextID));
					}}>Genomför</ContextSyncButton>
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
	const { context } = state;
	return {
		show: context.showModal,
		target: context.modalTarget,
		roles: context.roles,
		units: context.units,
		currentRole: context.currentRole,
		currentUnit: context.currentUnit,
		currentContext: context.currentContext,
		isDirty: context.isDirty,
		isSyncing: context.isSyncing
	};
}

export default connect(mapStateToProps)(Context);
