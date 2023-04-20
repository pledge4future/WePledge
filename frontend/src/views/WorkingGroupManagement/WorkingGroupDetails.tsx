import { useQuery } from '@apollo/client';
import { Container, Grid } from '@material-ui/core';
import React from 'react';
import { getUserProfile } from '../../api/Queries/me';
import { WorkingGroupAdminDetails } from './WorkingGroupAdminDetails';

export default function WorkingGroupDetailsView(){

    const { loading: profile_loading, error: profile_error, data: profile_data } = useQuery(getUserProfile);

    const workingGroup = profile_data?.me?.workingGroup;

    return (
        <Container>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={4}>
                    <span><b>Working Group Name: </b></span>
                </Grid>
                <Grid item xs={8}>
                    <span>{workingGroup?.name}</span>
                </Grid>
                <Grid item xs={4}>
                    <span><b>Working Group Institute: </b></span>
                </Grid>
                <Grid item xs={8}>
                    <span>{workingGroup?.institution?.name}</span>
                </Grid>
                <Grid item xs={4}>
                    <span><b>Research Field: </b></span>
                </Grid>
                <Grid item xs={8}>
                    <span>{`${workingGroup?.field?.field} - ${workingGroup?.field?.subfield}`}</span>
                </Grid>
                <Grid item xs={4}>
                    <span><b>Number of employees: </b></span>
                </Grid>
                <Grid item xs={8}>
                    <span>{workingGroup?.nEmployees}</span>
                </Grid>
            </Grid>
            {profile_data?.me?.isRepresentative && (
                <WorkingGroupAdminDetails workingGroup={workingGroup} />
            )}
        </Container>
    )
}