import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core';
import { Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import { getWorkingGroups } from '../../api/Queries/working-groups';
import WorkingGroupCard from '../../components/WorkingGroupCard';
import { IWorkingGroup } from '../../interfaces/IWorkingGroup';


export default function FindWorkingGroupView(){

    const {data: workingGroupData} = useQuery(getWorkingGroups)
    console.log("🚀 ~ file: FindWorkingGroup.tsx ~ line 13 ~ FindWorkingGroupView ~ workingGroupData", workingGroupData)

    const [searchInput, setSearchInput] = useState('')

    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value)
    }

    const requestJoinWorkingGroup = (workingGroup: IWorkingGroup) => {
        // add here endpoint to request working group joining
    }

    let test_data;
    if(workingGroupData){
        test_data = [...workingGroupData.workinggroups,...workingGroupData.workinggroups,...workingGroupData.workinggroups,...workingGroupData.workinggroups,...workingGroupData.workinggroups]
    }
    console.log("🚀 ~ file: FindWorkingGroup.tsx ~ line 26 ~ FindWorkingGroupView ~ test_data", test_data)

    
    return (
        <Grid container justifyContent={"center"} alignItems={"center"} spacing={2}>
            <Grid item xs={12}>
                <TextField
                fullWidth
                value={searchInput}
                onChange={handleSearchInput}
                variant={'outlined'}
                label={'Search'}
                />
            </Grid>
            {/* {workingGroupData?.workinggroups?.map((workingGroup: IWorkingGroup) => {
                return (
                    <Grid item xs={3}>
                        <WorkingGroupCard 
                        workingGroup={workingGroup}
                        requestJoinWorkingGroup={requestJoinWorkingGroup}
                    />
                    </Grid>
                )
            })} */}
            {test_data?.map((workingGroup: IWorkingGroup) => {
                return (
                    <Grid item xs={3}>
                        <WorkingGroupCard 
                        workingGroup={workingGroup}
                        requestJoinWorkingGroup={requestJoinWorkingGroup}
                    />
                    </Grid>
                )
            })}
        </Grid>
    )
}
