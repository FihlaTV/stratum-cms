import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { initContextSelector, unitChange, roleChange, setEntering } from '../actions/context';
import { Overlay, Popover, Button } from 'react-bootstrap';
import UnitList from '../components/UnitList';
import ContextSyncButton from '../components/ContextSyncButton';

class Context extends Component {
	componentDidMount () {}
	componentWillReceiveProps (nextProps) {
		const { contexts, inRole, inUnit, dispatch, firstTime } = nextProps;
		if (this.props.contexts !== contexts) {
			dispatch(initContextSelector(contexts, inRole, inUnit, firstTime && !this.props.firstTime));
		}
	}
	render () {
		const {
			dispatch,
			show,
			roles = [],
			target,
			currentRole,
			currentUnit,
			onCancel,
			onFirstAccept,
			inRole,
			inUnit,
			requireChange,
			onSubmit,
			initial,
			currentContext,
			onLogout,
			entering,
			units,
			isSyncing,
			contexts,
		} = this.props;
		const allowAccept = initial && inUnit === currentUnit && inRole === currentRole;
		const register = contexts && contexts.length > 0 ? contexts[0].Unit.Register.RegisterName : null;
		return (
			<Overlay
				show={show}
				rootClose={!initial && !requireChange && !!onCancel}
				onHide={() => !entering && onCancel()}
				onEntering={() => dispatch(setEntering(true))}
				onEntered={() => dispatch(setEntering(false))}
				target={() => target}
				placement="bottom" >
				<Popover title="Byt enhet och/eller roll" id="context-popover">
					<UnitList
						units={units.map(u => ({ name: u.UnitName, id: u.UnitID, code: u.UnitCode }))}
						roles={roles.map(r => ({ name: r.RoleName, id: r.RoleID }))}
						roleChange={role => dispatch(roleChange(role))}
						unitChange={unit => dispatch(unitChange(unit))}
						currentRole={currentRole}
						currentUnit={currentUnit}
						context={currentContext}
						register={register}
						/>
					{!allowAccept
						&& <ContextSyncButton
							bsStyle="primary"
							href="#!"
							block
							disabled={!currentUnit || inUnit === currentUnit && inRole === currentRole}
							isSyncing={isSyncing}
							onClick={() => {
								onSubmit(currentRole, currentUnit);
							}}>
							{requireChange ? 'Acceptera' : 'Byt'}
						</ContextSyncButton>}
					{allowAccept && <Button bsStyle="primary" block onClick={onFirstAccept}>Acceptera</Button>}
					{!initial && !requireChange && onCancel && <Button block onClick={onCancel}>Avbryt</Button>}
					<Button
						block
						href="/logout"
						onClick={onLogout}
						>
						Logga ut
					</Button>
				</Popover>
			</Overlay>
		);
	}
}

Context.propTypes = {
	dispatch: PropTypes.func.isRequired,
	onCancel: PropTypes.func,
	onChange: PropTypes.func,
};

function mapStateToProps (state) {
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
		entering: context.entering,
		isSyncing: context.isSyncing,
	};
}

export default connect(mapStateToProps)(Context);
