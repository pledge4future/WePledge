import { InputAdornment, Tooltip, IconButton } from "@material-ui/core";
import HelpIcon from "@mui/icons-material/Help";
import React from "react";

export function InputFieldTooltip(props: { text: any; position: any; style?: any }) {
  const { text, position, style } = props;
  return (
    <InputAdornment position={position} style={style}>
      <Tooltip title={text}>
        <IconButton>
          <HelpIcon />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );
}
