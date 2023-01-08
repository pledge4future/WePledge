import React from "react";

import { FieldProps, getIn } from "formik";
import { TextField } from "@material-ui/core";

export const FormTextField: React.FC<FieldProps> = ({
  field,
  form,
  ...props
}) => {
  const errorText =
    getIn(form.touched, field.name) && getIn(form.errors, field.name);

  return (
    <TextField fullWidth margin="normal" variant="outlined"
      helperText={errorText}
      error={!!errorText}
      {...field}
      {...props}
    />
  );
};