import React from 'react';
import {Input, Textarea, Select, } from '.';

function FormikControl(props) {
	const {control, ...rest} = props
	switch(control) {
		case 'input': return <Input {...rest}/>
		case 'textarea': return <Textarea {...rest}/>
		case 'select': return <Select {...rest}/>
		// case 'radio': return <Input {...rest}/>
		// case 'checkbox': return <Input {...rest}/>
		// case 'date': return <Input {...rest}/>
		default: return null
	}
}

export default FormikControl