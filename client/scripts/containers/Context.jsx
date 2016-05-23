import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { initContextSelector, fetchContexts, unitChange, roleChange, syncContext } from '../actions/context';
import { Overlay, Popover, Button } from 'react-bootstrap';
import UnitList from '../components/UnitList';
import ContextSyncButton from '../components/ContextSyncButton';

class Context extends Component {
	componentDidMount() {
		const { dispatch } = this.props;
	}
	componentWillReceiveProps(nextProps){
		const { contexts, inRole, inUnit, dispatch, firstTime } = nextProps;
		if(this.props.contexts !== contexts){
			dispatch(initContextSelector(contexts, inRole, inUnit, firstTime && !this.props.firstTime));
		}
	}
	render() {
		const { 
			dispatch,
			show,
			roles = [],
			target,
			currentRole,
			currentUnit,
			onCancel,
			inRole,
			inUnit,
			requireChange,
			onSubmit,
			initial,
			currentContext,
			onLogout,
			units,
			isSyncing,
			error
		} = this.props;
		const allowAccept = initial && inUnit === currentUnit && inRole === currentRole;
		return (
			<Overlay 
				show={show} 
				target={() => target}
				placement="bottom" >
				<Popover title="Byt enhet och/eller roll" id="context-popover">
					<UnitList 
						units={units.map(u => ({name: u.UnitName, id: u.UnitID, code: u.UnitCode}))}
						roles={roles.map(r => ({name: r.RoleName, id: r.RoleID}))}
						roleChange={role => dispatch(roleChange(role))}
						unitChange={unit => dispatch(unitChange(unit))}
						currentRole={currentRole}
						currentUnit={currentUnit}
						context={currentContext}
					/>
					{!allowAccept && 
					<ContextSyncButton bsStyle="primary" block disabled={!currentUnit || inUnit === currentUnit && inRole === currentRole} isSyncing={isSyncing} onClick={() => {
						onSubmit(currentContext);
					}}>Byt</ContextSyncButton>}
					{allowAccept && <Button bsStyle="primary" block onClick={onCancel}>Acceptera</Button>}
					{!initial && !requireChange && onCancel && <Button block onClick={onCancel}>Avbryt</Button>}
					<Button block href="/logout" onClick={onLogout}>Logga ut</Button>
				</Popover>
			</Overlay>
		);
	}
}

Context.propTypes = {
    dispatch: PropTypes.func.isRequired,
	onChange: PropTypes.func,
	onCancel: PropTypes.func
};

function mapDispatchToProps(dispatch){
	return {
	};
}
function mapStateToProps(state){
	const { context } = state;
	return {
		show: context.show,
		target: context.target,
		roles: context.roles,
		units: context.units,
		currentRole: context.currentRole,
		currentUnit: context.currentUnit,
		currentContext: context.currentContext,
		initial: context.initial,
		isSyncing: context.isSyncing
	};
}

export default connect(mapStateToProps)(Context);
