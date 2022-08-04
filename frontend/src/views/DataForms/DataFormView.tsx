import { Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import { TabPanel } from "../Dashboard/TabPanel";
import{useRouter} from 'next/router'

import { ElectricityForm, ElectricityFormValues } from './ElectricityForm';
import { HeatingForm, HeatingFormValues } from './HeatingForm';
import { CommutingForm, CommutingFormValues } from './CommutingForm';
import { BusinessTripForm, BusinessFormValues } from './BusinessTripForm';

function a11yProps(index: any){
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpane.l${index}`
  }
}


export default function DataFormView(){

  const router = useRouter();

  const [value, setValue] = useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number)=>{
    console.log(event);
    setValue(newValue);
  }

  const onESubmit = (values: ElectricityFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    console.log(values);
    setSubmitting(false);
    //router.push('/dashboard')
  }

  const onHSubmit = (values: HeatingFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    console.log(values)
    setSubmitting(false)
    //router.push('/dashboard')
  }

  const onCSubmit = (values: CommutingFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    console.log(values)
    setSubmitting(false)
    //router.push('/dashboard')
  }

  const onBSubmit = (values: BusinessFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    console.log(values)
    setSubmitting(false)
    //router.push('/dashboard')
  }
  const tabContents = [<ElectricityForm error={false} onSubmit = {onESubmit} />, <HeatingForm error={false} onSubmit={onHSubmit}/>, 
                      <CommutingForm error={false} onSubmit = {onCSubmit}/>, 
                      <BusinessTripForm error={false} onSubmit = {onBSubmit}/>]

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
