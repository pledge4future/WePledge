import { IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Tooltip } from "@material-ui/core";
import { red } from '@mui/material/colors';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import React, { useState } from "react";
import theme from "../../theme";
import { useMutation } from "@apollo/client";
import { REMOVE_USER_FROM_WORKING_GROUP } from "../../api/mutations/working-group-mutations";
import { Alert } from "@mui/material";
import { RemoveUserDialog } from "./RemoveUserDialog";
import { useRouter } from "next/router";

interface IWorkingGroupUsersTableProps {
    data: any
}

interface IUserTableRow {
    firstName: string,
    lastName: string, 
    id: string, 
    email: string, 
    __typename: string
}
  


export const WorkingGroupUsersTable = (props: IWorkingGroupUsersTableProps) => {

    const router = useRouter();

    const {data: tableData} = props;

    const [showDialog, setShowDialog] = useState(false);
    const [userToRemove, setUserToRemove] = useState({} as IUserTableRow)

    const [errorState, setErrorState] = useState(false);
    const [successState, setSuccessState] = useState(false);

    const [sendRemoveUserFromWorkingGroupRequest] = useMutation(REMOVE_USER_FROM_WORKING_GROUP, {
        onCompleted(res){
            router.reload();
        }
    })

    function formatUserName(row: IUserTableRow){
        return `${row.firstName} ${row.lastName}`
    }

    const handleUserRemove = (row: IUserTableRow) => {
        setUserToRemove(row);
        setShowDialog(true)
    }

    const handleRemoveUserDialogClose = (() => {
        setUserToRemove({} as IUserTableRow);
        setShowDialog(false);
    });

    const handleRemoveUserMutation = (userID: string) => {
        sendRemoveUserFromWorkingGroupRequest({
            variables: {
                userID: userID
            }
        })
    }

    return (
        <React.Fragment>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>User Name</TableCell>
                        <TableCell align="right">User eMail</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                    </TableHead>
                <TableBody>
                {tableData?.map((row: IUserTableRow) => (
                    <TableRow
                        key={row.id}
                    >
                        <TableCell component="th" scope="row">
                            {formatUserName(row)}
                        </TableCell>
                        <TableCell align="right">{row.email}</TableCell>
                        <TableCell align="right">
                            <ThemeProvider theme={theme}>
                                <IconButton style={{color: red[500]}} onClick={() => handleUserRemove(row)}>
                                    <Tooltip title="Remove user from working group">
                                        <PersonRemoveIcon />
                                    </Tooltip>
                                </IconButton>
                            </ThemeProvider>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
    </TableContainer>
    <RemoveUserDialog isOpen={showDialog} handleDialogClose={handleRemoveUserDialogClose} user={userToRemove} removeUserMutation={handleRemoveUserMutation}/>
    <Snackbar open={successState} autoHideDuration={6000} onClose={() => setSuccessState(false)}>
                <Alert onClose={() => setSuccessState(false)} severity="success" sx={{ width: '100%' }}>
                    Successfully removed user from working group. 
                </Alert>
            </Snackbar>
            <Snackbar open={errorState} autoHideDuration={6000} onClose={() => setErrorState(false)}>
                <Alert onClose={() => setErrorState(false)} severity="error" sx={{ width: '100%' }}>
                Failed to remove user from working group, try again!
                </Alert>
            </Snackbar>
    </React.Fragment>
    )
}