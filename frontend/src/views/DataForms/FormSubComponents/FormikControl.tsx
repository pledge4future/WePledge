import React from 'react';

function FormikControl(props) {
	const {control} = props
	switch(control) {
		case 'input':
		case 'textarea':
		case 'select':
		case 'radio':
		case 'checkbox':
		case 'date':
		default: return null
	}
	return (
		<div>

		</div>
	)

}

export default FormikControl