import React from 'react';
import { PageContainer } from '../src/components';
import WorkingGroupDetailsView from '../src/views/WorkingGroupManagement/WorkingGroupDetails';
import withRoot from '../src/withRoot';


function WorkingGroupDetailsPage(){

    return (
        <PageContainer title={"Working Group Details"}>
            <>
            <WorkingGroupDetailsView />
            </>
        </PageContainer>
    )
}


export default withRoot(WorkingGroupDetailsPage)