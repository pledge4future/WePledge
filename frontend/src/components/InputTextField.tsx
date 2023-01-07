import * as React from 'react';

import { TextField } from '@material-ui/core';

function InputTextField(props) {
	return (
		<TextField
			required={props.required}
			select={props.select}
			type={props.type}
			id={props.id}
			name={props.name}

			label={props.label}
			value={props.value}
			onChange={props.onChange}
			error={props.error}
			helperText={props.helperText}
			InputProps={props.InputProps}

			InputLabelProps={{shrink: true}}
			fullWidth
			margin="normal"
			variant="outlined"
			>
		</TextField>
	);
};

export default InputTextField;