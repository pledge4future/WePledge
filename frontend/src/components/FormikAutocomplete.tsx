import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField, TextFieldProps } from '@material-ui/core';
import { fieldToTextField } from 'formik-material-ui';

// we need this special component because materialUI autocomplete component can not be easily integrated into formik form management.


const FormikAutocomplete = ({ textFieldProps, ...props } : {textFieldProps: any, props: TextFieldProps}) => {

  //@ts-ignore
  const { form: { setFieldValue } } = props;
  //@ts-ignore
  const { error, helperText, ...field } = fieldToTextField(props);
  const { name } = field;


  return (
    //@ts-ignore
    <Autocomplete
      {...props}
      {...field}
      onChange={ (_, value) => setFieldValue(name, value) }
      //@ts-ignore
      getOptionLabel={(option) => option?.name ?? ''}
      renderInput={ props => (
        <TextField {...props} {...textFieldProps} helperText={helperText} error={error} />
      )}
    />
  );
}

export default FormikAutocomplete;