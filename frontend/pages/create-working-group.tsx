import React from 'react';
import { PageContainer } from '../src/components';
import CreateWorkingGroupView from '../src/views/WorkingGroupManagement/CreateWorkingGroup';
import withRoot from '../src/withRoot';


function CreateWorkingGroupPage(){

        return (
            <PageContainer title={"Create Working Group"}>
                <>
                <CreateWorkingGroupView />
                </>
            </PageContainer>
        )
}

export default withRoot(CreateWorkingGroupPage)