import React from 'react';

import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container';
import { useQuery } from '@apollo/client';
import { getUserProfile } from '../../api/Queries/me';
import { CircularProgress, IconButton, Tooltip } from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import { useRouter } from 'next/router';



export default function WorkingGroupOverview(){

    const { loading, data } = useQuery(getUserProfile);


    const router = useRouter()

    const navigateToSearchView = (_e: any) => {
        router.push("/find-working-group")
    }

    const navigateToCreateWorkingGroup = (_e: any) => {
        router.push("/create-working-group")
    }


    const navigateToWorkingGroupDetails = (_e: any) => {
        const workingGroupId = data?.me?.workingGroup?.id ?? ''
        router.push(`/working-group-details?id=${workingGroupId}`)
    }


    return(
        <>
        <Container>
            {loading && (
                <React.Fragment>
                    <CircularProgress color="primary"/>
                </React.Fragment>
            )}
            {!loading && (
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={4}>
                        <span>Your Working Group: </span>
                    </Grid>
                    {!!data && !data?.workingGroup && (
                        <>
                        <Grid item xs={4}>
                            <span style={{fontWeight: 'bold'}}>{data?.me?.workingGroup?.name ?? 'No working group'}</span>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="primary" disabled={!data?.me?.workingGroup} onClick={navigateToWorkingGroupDetails}>
                                <Tooltip title="See working group details">
                                    <GroupIcon />
                                </Tooltip>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                           <IconButton color="primary" onClick={navigateToCreateWorkingGroup}>
                            <Tooltip title="Create new working group">
                                <AddIcon />
                            </Tooltip>
                           </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="secondary" onClick={navigateToSearchView}>
                                <Tooltip title="Search for existing working group">
                                    <SearchIcon />
                                </Tooltip>
                            </IconButton>
                        </Grid>
                        </>
                    )}
                </Grid>
            )}
        </Container>
        </>
    )

}
