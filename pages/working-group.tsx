import React from 'react';
import { PageContainer } from '../src/components';
import WorkingGroupOverview from '../src/views/WorkingGroupManagement/WorkingGroupOverview';
import withRoot from '../src/withRoot';




function WorkingGroupPage(){

    return (
        <PageContainer title={"Working Groups"}>
            <>
            <WorkingGroupOverview />
            </>
        </PageContainer>
    )
}


export default withRoot(WorkingGroupPage)