import { Grid, makeStyles, createStyles, TextField } from "@material-ui/core";
import { Typography } from '../../components';
import { useFormik } from "formik";



export interface IAddressInputFormProps {
    title?: string
    setAddress: (value: any) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    formContainer: {
        marginTop: 20,
    }
  })
);


const initialAddressInputFormValues = {
    address: '',
    city: '',
    country: '',
}


const textInputStyle = {margin: 8}

export const AddressInputForm = ((props: IAddressInputFormProps) => {


    const { title, setAddress } = props;

    const classes = useStyles();

    const addressInputForm = useFormik({
        initialValues: initialAddressInputFormValues,
        onSubmit: () => {
            // no need to submit the form, jsut satisfy linter
        }
    })

    const customOnChange = ((e: any) => {
        addressInputForm.handleChange(e);
        setAddress(e.target)
    })

    return (
        <div className={classes.formContainer}>
        {title && (
            <Typography variant="h5" gutterBottom marked="center" align="center">
                {title}
            </Typography>
        )}
        <Grid container spacing={2} justifyContent='center' alignItems='center'>
            <Grid item xs={4}>
                <TextField
                fullWidth
                style={textInputStyle}
                margin="normal"
                InputLabelProps={{shrink:true}}
                variant="outlined"
                id="address"
                name="address"
                label="Address"
                value={addressInputForm.values.address}
                onChange={customOnChange}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                fullWidth
                style={textInputStyle}
                margin="normal"
                InputLabelProps={{
                    shrink: true
                }}
                variant="outlined"
                id="city"
                name="city"
                label="City"
                value={addressInputForm.values.city}
                onChange={customOnChange}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                fullWidth
                style={textInputStyle}
                margin="normal"
                InputLabelProps={{
                    shrink:true
                }}
                variant="outlined"
                id="country"
                name="country"
                label="Country"
                value={addressInputForm.values.country}
                onChange={customOnChange}
                />
            </Grid>
        </Grid>
        </div>
    )   
});