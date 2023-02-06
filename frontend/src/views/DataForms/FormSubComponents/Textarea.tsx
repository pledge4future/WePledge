import React from "react";
import { Field, ErrorMessage } from "formik";
import { InputFieldTooltip } from "./InputFieldTooltip";
import { tooltips } from "../FormTooltips";
import { TextField } from "@material-ui/core";

// import TextError from './TextError'

function Textarea(props) {
  const { label, name, ...rest } = props;
  return (
    <div className="form-control">
      <label htmlFor={name}>{label}</label>
      <TextField
        id={name}
        name={name}
        {...rest}
        style={{ margin: 8 }}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        InputProps={{
          endAdornment: <InputFieldTooltip position={"end"} text={tooltips.building} />,
        }}
      />
      {/* <ErrorMessage component={TextError} name={name} /> */}
    </div>
  );
}

export default Textarea;
