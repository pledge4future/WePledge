import { Tab, Tabs } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { TabPanel } from "../Dashboard/TabPanel";

import { ElectricityForm, ElectricityFormValues } from './ElectricityForm';
import { HeatingForm, HeatingFormValues } from './HeatingForm';
import { CommutingForm, CommutingFormValues } from './CommutingForm';
import { BusinessTripForm, BusinessFormValues } from './BusinessTripForm';
import { getUserProfile } from "../../api/Queries/me";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../../providers/Auth";

function a11yProps(index: any){
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpane.l${index}`
  }
}



export default function DataFormView(){
  
  const authContext = useContext(AuthContext);
  const { data } = useQuery(getUserProfile);
  const showAllTabs = !authContext.isAuthenticated || data?.me?.isRepresentative
  const [value, setValue] = useState(showAllTabs ? 0 : 2)

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number)=>{
    console.log(newValue);
    setValue(newValue);
  }

  const onESubmit = (_values: ElectricityFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(false);
  }

  const onHSubmit = (_values: HeatingFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(false)
  }

  const onCSubmit = (_values: CommutingFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(false)
  }

  const onBSubmit = (_values: BusinessFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(false)
  }
  const tabContents = [<ElectricityForm error={false} onSubmit = {onESubmit} />, <HeatingForm error={false} onSubmit={onHSubmit}/>, 
                      <CommutingForm error={false} onSubmit = {onCSubmit}/>, 
                      <BusinessTripForm error={false} onSubmit = {onBSubmit}/>]

  return <React.Fragment>
    <Tabs value={value} onChange={handleChange} aria-label="forms tabs">
      {showAllTabs && (
        <Tab label="Electricity" {...a11yProps(0)} value={0}/>
      )}
      {showAllTabs && (
        <Tab label="Heating" {...a11yProps(1)}  value={1}/>
      )}
      <Tab label="Commuting" {...a11yProps(2)} value={2}/>
      <Tab label="Business Trip" {...a11yProps(3)} value={3}/>
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
