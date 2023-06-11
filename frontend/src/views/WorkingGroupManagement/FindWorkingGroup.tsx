import { useMutation, useQuery } from '@apollo/client';
import { Alert, Grid, Snackbar, TextField } from '@mui/material';
import React, { useState } from 'react';
import { REQUEST_JOIN_WORKING_GROUP } from '../../api/mutations/working-group-mutations';
import { getWorkingGroups } from '../../api/Queries/working-groups';
import WorkingGroupCard from '../../components/WorkingGroups/WorkingGroupCard';
import { IWorkingGroup } from '../../interfaces/IWorkingGroup';


export default function FindWorkingGroupView(){

    const {data: workingGroupData} = useQuery(getWorkingGroups)

    const [searchInput, setSearchInput] = useState('')
    const [successState, setSuccessState ] = useState(false);
    const [errorState, setErrorState ] = useState(false);

    const [sendRequestJoinWorkingGroup] = useMutation(REQUEST_JOIN_WORKING_GROUP, {
        onCompleted(result) {
          if(result.requestJoinWorkingGroup.success === true){
            setSuccessState(true);
          } else {

          }
        }
      });

    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value)
    }

    const requestJoinWorkingGroup = (workingGroup: IWorkingGroup) => {
        console.log(workingGroup)
        sendRequestJoinWorkingGroup({
            variables: {
                id: workingGroup.id
            }
        })
    }
    
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
        <Snackbar open={successState} autoHideDuration={6000} onClose={() => setSuccessState(false)}>
            <Alert onClose={() => setSuccessState(false)} severity="success" sx={{ width: '100%' }}>
                Request sent successfully!
            </Alert>
        </Snackbar>
        <Snackbar open={errorState} autoHideDuration={6000} onClose={() => setErrorState(false)}>
            <Alert onClose={() => setErrorState(false)} severity="error" sx={{ width: '100%' }}>
                Failt to send join request. Try again or Contact the website administrators for help!
            </Alert>
        </Snackbar>
        </>
    )
}

