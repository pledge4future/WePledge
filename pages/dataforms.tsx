import * as React from 'react';
import withRoot from "../src/withRoot";

import PageContainer from "../src/components/PageContainer";
import AddDataForms from '../src/views/DataForms'



function DataFormsPage(){
  return (
    <PageContainer title={"Data Forms"} showTitle={false}>
      <AddDataForms />
    </PageContainer>
  )
}


export default withRoot(DataFormsPage)
