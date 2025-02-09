import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export function TabPanel(props: TabPanelProps){
    const { children, index, value, ...other} = props;

    return (
      <div
      role="tabpanel"
      hidden={value !== index}
      id = {`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      >
        {value === index && (
          <Box p = {3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    )
    
}
