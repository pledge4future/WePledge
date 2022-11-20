import { useQuery } from '@apollo/client';
import React from 'react';
import { getWorkingGroups } from '../../api/Queries/working-groups';


export default function FindWorkingGroupView(){

    const {data: workingGroupData} = useQuery(getWorkingGroups)
    console.log("🚀 ~ file: FindWorkingGroup.tsx ~ line 9 ~ FindWorkingGroupView ~ workingGroupData", workingGroupData)
    
    return (
        <div>
            FindWorkingGroupView
        </div>
    )
}
