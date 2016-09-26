import React, { PropTypes } from 'react';
import '../../../public/styles/site/form.less';


const InputPersonalNr = ({
		onChange,
		onSubmit,
		valid,
	}) => {

	let input;
	let classNames = ['form-group', 'has-feedback', 'form-right-icon', valid ? 'has-success' : 'has-error'];


	return (
		<form onChange={(e) => {
			return onChange(input.value);
		}}
			onSubmit={(e) => {
				e.preventDefault();
				return onSubmit(input.value);
			}}>
			<div className={classNames.join(' ')}>
				<label htmlFor="bankIDPersonalNr">Personnummer: </label>
				<div className="input-group">
					<span className="input-group-addon"><i className="fa fa-user" /></span>
					<input
						type="text"
						className="form-control check-validation next-to-icon"
						placeholder="19xxxxxx-xxxx"
						autoComplete="off"
						id="bankIDPersonalNr"
						ref={(node) => {
							input = node;
						}
						}
					/>
				</div>
				<span className={`fa fa-check form-control-feedback ${valid ? '' : 'hidden'}`} />
			</div>
		</form>
	);

};

InputPersonalNr.propTypes = {
	onSubmit: PropTypes.func.isRequired,
};

 export default InputPersonalNr;
