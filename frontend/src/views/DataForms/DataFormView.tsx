import { Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import { TabPanel } from "../Dashboard/TabPanel";

import { ElectricityForm } from './ElectricityForm';
import { HeatingForm } from './HeatingForm';
import { CommutingForm } from './CommutingForm';
import { BusinessTripForm } from './BusinessTripForm';

function a11yProps(index: any){
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpane.l${index}`
  }
}


export default function DataFormView(){

  const [value, setValue] = useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number)=>{
    setValue(newValue);
  }

  const tabContents = [<ElectricityForm />, <HeatingForm />, <CommutingForm />, <BusinessTripForm />]

  return <React.Fragment>
    <Tabs value={value} onChange={handleChange} aria-label="forms tabs">
      <Tab label="Electricity" {...a11yProps(0)} />
      <Tab label="Heating" {...a11yProps(1)} />
      <Tab label="Commuting" {...a11yProps(2)} />
      <Tab label="Business Trip" {...a11yProps(3)} />
    </Tabs>
    {
      tabContents.map((content, index) => {
        return (
          <TabPanel value={value} index={index}>
            {content}
          </TabPanel>
        );
      })
    }
  </React.Fragment>
}
