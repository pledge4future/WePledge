import { Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import { TabPanel } from "../Dashboard/TabPanel";

import { ElectricityForm, ElectricityFormValues } from './ElectricityForm';
import { HeatingForm, HeatingFormValues } from './HeatingForm';
import { CommutingForm, CommutingFormValues } from './CommutingForm';
import { BusinessTripForm, BusinessFormValues } from './BusinessTripForm';
import { getUserProfile } from "../../api/Queries/me";
import { useQuery } from "@apollo/client";

function a11yProps(index: any){
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpane.l${index}`
  }
}



export default function DataFormView(){
  
  //TODO: Handle Loading and Error States (this is not trivial because the data forms should also be available in the demo mode)
  // Use AuthContext like in the following lines
  // const authContext = useContext(AuthContext);
  // const [isDemoMode, setIsDemoMode] = useState(authContext.isAuthenticated)
  // const { loading, error, data } = useQuery(getUserProfile);
  // const showAllTabs = isAuthenticated || data?.me?.isRepresentative
  // const [value, setValue] = useState(showAllTabs ? 0 : 2)
  // Then also change conditional rendering of tabs further below...
  const { loading, error, data } = useQuery(getUserProfile);
  const [value, setValue] = useState(data?.me?.isRepresentative ? 0 : 2)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number)=>{
    setValue(newValue);
  }

  const onESubmit = (values: ElectricityFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(false);
  }

  const onHSubmit = (values: HeatingFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(false)
  }

  const onCSubmit = (values: CommutingFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(false)
  }

  const onBSubmit = (values: BusinessFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(false)
  }
  const tabContents = [<ElectricityForm error={false} onSubmit = {onESubmit} />, <HeatingForm error={false} onSubmit={onHSubmit}/>, 
                      <CommutingForm error={false} onSubmit = {onCSubmit}/>, 
                      <BusinessTripForm error={false} onSubmit = {onBSubmit}/>]

  return <React.Fragment>
    <Tabs value={value} onChange={handleChange} aria-label="forms tabs">
      {data?.me?.isRepresentative && (
        <>
        <Tab label="Electricity" {...a11yProps(0)} />
        <Tab label="Heating" {...a11yProps(1)} />
        </>
      )}
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
