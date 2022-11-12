import React from 'react';
import { PageContainer } from '../src/components';
import FindWorkingGroupView from '../src/views/WorkingGroupManagement/FindWorkingGroup';
import withRoot from '../src/withRoot';


function FindWorkingGroupPage(){
    return (
        <PageContainer title={"Working Groups"}>
            <>
            <FindWorkingGroupView />
            </>
        </PageContainer>
    )
}

export default withRoot(FindWorkingGroupPage)