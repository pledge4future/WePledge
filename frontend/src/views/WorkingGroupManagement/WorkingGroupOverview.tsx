import React, { useRef, useState } from 'react';
import withRoot from "../../withRoot";

import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container';
import { useQuery } from '@apollo/client';
import { getUserProfile } from '../../api/Queries/me';
import { CircularProgress, IconButton, makeStyles, Modal, Tooltip } from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import { useRouter } from 'next/router';



export default function WorkingGroupOverview(){

    const { loading, error, data } = useQuery(getUserProfile);


    const router = useRouter()

    const navigateToSearchView = (e: any) => {
        router.push("/find-working-group")
    }

    const navigateToCreateWorkingGroup = (e: any) => {
        router.push("/create-working-group")
    }


    const navigateToWorkingGroupDetails = (e: any) => {
        const workingGroupId = data?.workingGroup?.id ?? ''
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
                    <Grid item xs={6}>
                        <span>Your Working Group: </span>
                    </Grid>
                    {!!data && !data?.workingGroup && (
                        <>
                        <Grid item xs={2}>
                            <span style={{fontWeight: 'bold'}}>No working group </span>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="success" disabled={!data?.workingGroup} onClick={navigateToWorkingGroupDetails}>
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
