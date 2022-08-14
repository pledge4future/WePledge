import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, Typography } from "@material-ui/core";
import { Alert, AlertTitle } from "@mui/material";
import React, { useContext } from "react";
import { gql, useMutation } from '@apollo/client';
import { useState } from "react";
import { useFormik } from "formik";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import * as yup from 'yup'
import router from "next/router";
import { AuthContext } from "../providers/Auth";

// make the dialog slide in -> implement later
/* const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  }); */

const SEND_SECONDARY_EMAIL_ACTIVATION = gql`
mutation sendSecondaryEmailAvtivation($newEmail: String!, $password: String!){
    sendSecondaryEmailActivation (email: $newEmail, password: $password){
      success,
      errors
    }
  }
`

const CONFIRM_EMAIL_CHANGE = gql`
mutation confirmEmailChange($token: String!, $password: String!){
    verifySecondaryEmail(
      token: $token
    ) {
      success,
      errors
    }
    swapEmails(
      password: $password
    ) {
      success,
      errors
    }
    removeSecondaryEmail(
      password: $password
    ) {
      success,
      errors
    }
  }
`

const newEmailFormInitialValues = {
    newEmail: '',
    password: ''
}

const newEmailFormValidationSchema = yup.object({
    newEmail: yup
        .string()
        .email("Invalid Email")
        .required("Email is required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required")
})

const confirmationFormValidationSchema = yup.object({
    token: yup
    .string()
    .required()
})

interface UnderConstructionDialogProps{
    isOpen: boolean,
    handleDialogClose: () => void;
}

export function EmailSwapDialog(props: UnderConstructionDialogProps){

    const {isOpen, handleDialogClose} = props

    const authContext = useContext(AuthContext);

    const [ confirmationMode, setConfirmationMode ] = useState(false)
    const [ errorState, setErrorState ] = useState(false)

    const [sendSecondaryEmailActivation] = useMutation(SEND_SECONDARY_EMAIL_ACTIVATION, {
        onCompleted: (result) => {
            if(result["sendSecondaryEmailActivation"].success){
                setConfirmationMode(true)
            } else {
                console.log(result)
                setErrorState(true);
            }
        }
    })
    
    const [confirmEmailChange] = useMutation(CONFIRM_EMAIL_CHANGE, {
        onCompleted: (result) => {
            if(result['verifySecondaryEmail'].success && result["swapEmails"].success && result["removeSecondaryEmail"].success){
                authContext.logout()
                router.push("/sign-in")
            } else {
                setErrorState(true)
            }
        }
    })

    const newEmailForm = useFormik({
        initialValues: newEmailFormInitialValues,
        validationSchema: newEmailFormValidationSchema,
        onSubmit: (newEmailFormValues) => {
            sendSecondaryEmailActivation({
                variables: {
                    newEmail: newEmailFormValues.newEmail,
                    password: newEmailFormValues.password
                }
            })
        }
    })

    const confirmationForm = useFormik({
        initialValues: {
            token: '',
        }, 
        validationSchema: confirmationFormValidationSchema,
        onSubmit: (confirmationFormValues) => {
            confirmEmailChange({
                variables: {
                    token: confirmationFormValues.token, 
                    password: newEmailForm.values.password
                }
            })
        }
    })

    return (
        <Dialog open={isOpen} onClose={handleDialogClose}>
            <DialogTitle id="alert-dialog-title">{"Enter your new Email"}</DialogTitle>
            <DialogContent>
                {!confirmationMode && (
                <React.Fragment>
                <form noValidate onSubmit={newEmailForm.handleSubmit}>
                    <TextField required
                    id="newEmail"
                    label="New Email"
                    name="newEmail"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{shrink:true}}
                    value={newEmailForm.values.newEmail}
                    onChange={newEmailForm.handleChange}
                    />
                    <TextField required
                    id="password"
                    type="password"
                    label="Password"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink:true}}
                    variant="outlined"
                    value={newEmailForm.values.password}
                    onChange={newEmailForm.handleChange}
                    />
                </form>
                </React.Fragment>
                )}
                {confirmationMode && (
                    <React.Fragment>
                    <ArrowBackIcon onClick={() => setConfirmationMode(false)} style={{cursor: 'default'}}/>
                    <div>We sent a confirmation code to your new Email address.</div>
                        <form onSubmit={confirmationForm.handleSubmit}>
                            <TextField
                            id="token"
                            label="confirmation code"
                            name="token"
                            fullWidth
                            required
                            margin="normal"
                            variant="outlined"
                            InputLabelProps = {{
                                shrink: true
                            }}
                            value={confirmationForm.values.token}
                            onChange={confirmationForm.handleChange}
                            />
                        </form>
                    </React.Fragment>
                )}
                <Typography variant="body2" align="center">
                <div>
                { errorState && (
                    <Alert severity="error">Please add valid credentials!</Alert>
                )}
                </div>
            </Typography>
            </DialogContent>
            <DialogActions>
                        {confirmationMode && (
                        <Button
                            type="submit"
                            color="primary"
                            size="large"
                            variant="contained"
                            disabled={!confirmationForm.dirty || !confirmationForm.isValid}
                            onClick={() => confirmationForm.submitForm()}>
                                Confirm Email Adress Change
                        </Button>
                        )}
                        {!confirmationMode && (
                            <Button
                            type="submit"
                            fullWidth
                            color="primary"
                            size="large"
                            variant="contained"
                            disabled={!newEmailForm.dirty || !newEmailForm.isValid}
                            onClick={() => newEmailForm.submitForm()}>
                                        Change Email
                            </Button>
                        )}
                        <Button
                            size="large"
                            variant="outlined"
                            autoFocus
                            onClick={handleDialogClose}
                            endIcon={<CloseIcon />}>
                                Abbort
                        </Button>
            </DialogActions>
        </Dialog>
    )
}