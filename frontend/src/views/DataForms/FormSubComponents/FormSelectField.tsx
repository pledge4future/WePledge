import React from "react";

import { FieldProps, getIn } from "formik";
import {
  FormControl,
  MenuItem,
  FormHelperText,
	TextField
} from "@material-ui/core";

export const FormSelectField: React.FC<
  FieldProps & {
    options: Array<{ label: string; value: string }>;
  }
> = ({ field, form, options, ...props }) => {
  const errorText =
    getIn(form.touched, field.name) && getIn(form.errors, field.name);
  return (
    <FormControl fullWidth error={!!errorText}>
      <TextField select fullWidth margin="normal" variant="outlined" InputLabelProps={{shrink: true}}
				{...field} {...props}>
        {options.map(op => (
          <MenuItem key={op.value} value={op.value}>
            {op.label}
          </MenuItem>
        ))}
      </TextField>
      <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
  );
};