import { useQuery } from '@apollo/client';
import { Container, Grid } from '@material-ui/core';
import React from 'react';
import { getUserProfile } from '../../api/Queries/me';
import { getWorkingGroupUsers, resolveWorkingGroupJoinRequests } from '../../api/Queries/working-groups';

export default function WorkingGroupDetailsView(){

    const { loading: profile_loading, error: profile_error, data: profile_data } = useQuery(getUserProfile);

    const { loading: users_loading, error: users_error, data: users_data} = useQuery(getWorkingGroupUsers)

    console.log(users_data)
    console.log(useQuery(resolveWorkingGroupJoinRequests))

    const workingGroup = profile_data?.me?.workingGroup;

    console.log(workingGroup);

    return (
        <Container>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={4}>
                    <span>{workingGroup?.name}</span>
                </Grid>
            </Grid>
        </Container>
    )
}