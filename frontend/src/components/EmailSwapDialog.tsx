import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@material-ui/core";
import { Alert } from "@mui/material";
import React, { useContext } from "react";
import { gql, useMutation } from '@apollo/client';
import { useState } from "react";
import { useFormik } from "formik";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import * as yup from 'yup'
import router from "next/router";
import { AuthContext } from "../providers/Auth";

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

    const [errorMessage, setErrorMessage ] = useState('')

    const [sendSecondaryEmailActivation] = useMutation(SEND_SECONDARY_EMAIL_ACTIVATION, {
        onCompleted: (result) => {
            if(result["sendSecondaryEmailActivation"].success){
                setConfirmationMode(true)
                setErrorState(false)
            } else {
                let errorMessage;
                if(result["sendSecondaryEmailActivation"].errors.email){
                    errorMessage = result["sendSecondaryEmailActivation"]?.errors?.email[0]?.message;
                }
                else if(result["sendSecondaryEmailActivation"].errors.password){
                    errorMessage = result["sendSecondaryEmailActivation"]?.errors?.password[0]?.message;
                }
                else {
                    errorMessage = "An unexpected error occured."
                }
                setErrorMessage(errorMessage)
                setErrorState(true);
            }
        }
    })
    
    const [confirmEmailChange] = useMutation(CONFIRM_EMAIL_CHANGE, {
        onCompleted: (result) => {
            if(result['verifySecondaryEmail'].success && result["swapEmails"].success && result["removeSecondaryEmail"].success){
                setErrorState(false)
                authContext.logout?.()
                router.push("/sign-in")
            } else {
                let errorMessage;
                if(!result['verifySecondaryEmail'].success){
                    errorMessage = result['verifySecondaryEmail'].errors.nonFieldErrors[0].message
                } else {
                    errorMessage = "An unexpected error occured."
                }
                setErrorState(true)
                setErrorMessage(errorMessage)
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
                <div style={{marginTop: 20}}>
                { errorState && (
                    <Alert severity="error">{errorMessage}</Alert>
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
                                Cancel
                        </Button>
            </DialogActions>
        </Dialog>
    )
}