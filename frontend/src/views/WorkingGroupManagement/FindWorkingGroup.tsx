import { useQuery } from '@apollo/client';
import { Grid, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import { getWorkingGroups } from '../../api/Queries/working-groups';
import { UnderConstructionDialog } from '../../components/UnderConstructionDialog';
import WorkingGroupCard from '../../components/WorkingGroupCard';
import { IWorkingGroup } from '../../interfaces/IWorkingGroup';


export default function FindWorkingGroupView(){

    const {data: workingGroupData} = useQuery(getWorkingGroups)

    const [searchInput, setSearchInput] = useState('')
    const [ showAlert, setShowAlert ] = useState(false);

    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value)
    }

    const requestJoinWorkingGroup = (workingGroup: IWorkingGroup) => {
        // add here endpoint to request working group joining
        setShowAlert(true)
    }

    const parentRef = useRef(null);
    
    return (
        <>
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
            {workingGroupData?.workinggroups?.filter((workingGroup: IWorkingGroup) => workingGroup.name.toLowerCase().includes(searchInput))
            .map((workingGroup: IWorkingGroup) => {
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
        <UnderConstructionDialog feature='Joining Working Group Feature' isOpen={showAlert} handleDialogClose={() => setShowAlert(false)}></UnderConstructionDialog>
        </>
    )
}

