import React from "react";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {TabPanel} from './TabPanel';

// import dashboard components
import { IndividualDashboard } from './IndividualDashboard';
import { GroupDashboard } from './GroupDashboard';
import { InstituteDashboard } from './InstituteDashboard';


function a11yProps(index: any){
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}




export default function DashboardView(){

  const [value, setValue] = React.useState(0);


  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    console.log(event); // only log to satisfy linter
    setValue(newValue);
  }


  return(
  <React.Fragment>
    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
      <Tab label="Individual Emissions" {...a11yProps(0)} />
      <Tab label="Group Emissions" {...a11yProps(1)} />
      <Tab label="Institute Emissions" {...a11yProps(2)} />
    </Tabs>
    <TabPanel value={value} index={0}>
      <IndividualDashboard></IndividualDashboard>
    </TabPanel>
    <TabPanel value={value} index={1}>
      <GroupDashboard></GroupDashboard>
    </TabPanel>
    <TabPanel value={value} index={2}>
      <InstituteDashboard></InstituteDashboard>
    </TabPanel>
  </React.Fragment>
  );
}

