import { Button, Checkbox, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';

export interface CreateWorkingGroupValues {
    name: string, 
    institute: string, 
    city: string, 
    country: string, 
    field: string, 
    subField: string, 
    nEmployees: number, 
    is_public: boolean
}


const newWorkingGroupValidationSchema = Yup.object({
    name: Yup.string().required('Working group name is required.'),
    institue: Yup.string().required('Please select an to which the working group belongs.')
})

export default function CreateWorkingGroupView(){

    const workingGroupForm = useFormik({
        initialValues: {
            name: '',
            institute: '',
            city: '',
            country: '',
            field: '',
            subField: '',
            nEmployees: 0,
            is_public: false
        },
        validationSchema: newWorkingGroupValidationSchema, 
        onSubmit: (newWorkingGroupValues: CreateWorkingGroupValues) => {
            console.log('clicked')
            console.log(newWorkingGroupValues)
        }
    })

    const instituteData = [
        {
            id: 'institute',
            label: 'institute1'
        },
        {
            id: 'institute2',
            label: 'institute2'
        },
        {
            id: 'institute3',
            label: 'institute3'
        }
    ]

    const researchFieldData = [
        {
            id: 'field',
            label: 'field1'
        },
        {
            id: 'field2',
            label: 'field2'
        },
        {
            id: 'field3',
            label: 'field3'
        }
    ]

    const researchSubFieldData = [
        {
            id: 'subField',
            label: 'subField1'
        },
        {
            id: 'subField2',
            label: 'subField2'
        },
        {
            id: 'subField3',
            label: 'subField3'
        }
    ]

    return (
        <form onSubmit={workingGroupForm.handleSubmit}>
        <Grid container justifyContent={"center"} alignItems={"center"} spacing={2}>
            <Grid item xs={6}>
                <InputLabel id="form-field-name">Name</InputLabel>
                <TextField required
                id="name"
                name="name"
                label="Name"
                labelId="form-field-name"
                fullWidth
                margin="normal"
                variant="outlined"
                value={workingGroupForm.values.name}
                onChange={workingGroupForm.handleChange}
                error={workingGroupForm.touched.name && Boolean(workingGroupForm.errors.name)}
                helperText={workingGroupForm.touched.name && workingGroupForm.errors.name}
                />
            </Grid>
            <Grid item xs={6}>
                <InputLabel id="form-field-institute">Institute</InputLabel>
                <Select
                    labelId="form-field-institute"
                    name="institute"
                    fullWidth
                    value={workingGroupForm.values.institute}
                    label="Institute"
                    onChange={workingGroupForm.handleChange}
                    error={workingGroupForm.touched.institute && Boolean(workingGroupForm.errors.institute)}
                    >
                    {instituteData.map(item => {
                        return (
                            <MenuItem value={item.id}>{item.label}</MenuItem>
                        )
                    })}
                </Select>
            </Grid>
            <Grid item xs={3}>
                <InputLabel id="form-field-city">City</InputLabel>
                <TextField required
                id="city"
                name="city"
                label="City"
                labelId="form-field-city"
                fullWidth
                margin="normal"
                variant="outlined"
                value={workingGroupForm.values.city}
                onChange={workingGroupForm.handleChange}
                error={workingGroupForm.touched.city && Boolean(workingGroupForm.errors.city)}
                helperText={workingGroupForm.touched.city && workingGroupForm.errors.city}
                />
            </Grid>
            <Grid item xs={3}>
                <InputLabel id="form-field-country">Country</InputLabel>
                <TextField required
                id="country"
                name="country"
                label="Country"
                labelId="form-field-country"
                fullWidth
                margin="normal"
                variant="outlined"
                value={workingGroupForm.values.country}
                onChange={workingGroupForm.handleChange}
                error={workingGroupForm.touched.country && Boolean(workingGroupForm.errors.country)}
                helperText={workingGroupForm.touched.country && workingGroupForm.errors.country}
                />
            </Grid>
            <Grid item xs={3}>
                <InputLabel id="form-field-employees">Number of Employees</InputLabel>
                <TextField 
                    required
                    id="nEmployees"
                    name="nEmployees"
                    label="Number of Employees"
                    labelId="form-field-employees"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="number"
                    value={workingGroupForm.values.nEmployees}
                    onChange={workingGroupForm.handleChange}
                    error={workingGroupForm.touched.nEmployees && Boolean(workingGroupForm.errors.nEmployees)}
                    helperTExt={workingGroupForm.touched.nEmployees && workingGroupForm.errors.nEmployees}
                />
            </Grid>
            <Grid item xs={3}>
                <FormControlLabel 
                control={
                    <Checkbox 
                        checked={workingGroupForm.values.is_public}
                        name="_isPublic" onChange={workingGroupForm.handleChange} 
                    />
                }
                label="Public Working Group"
                color="primary" />
            </Grid>
            <Grid item xs={6}>
                <InputLabel id="form-field-researchField">Research Field</InputLabel>
                <Select
                labelId="form-field-researchField"
                name="field"
                fullWidth
                value={workingGroupForm.values.field}
                label="Research Field"
                onChange={workingGroupForm.handleChange}
                error={workingGroupForm.touched.field && Boolean(workingGroupForm.errors.field)}
                >
                    {researchFieldData.map(item => {
                        return (
                            <MenuItem value={item.id}>{item.label}</MenuItem>
                        )
                    })}
                </Select>
            </Grid>
            <Grid item xs={6}>
                <InputLabel id="form-field-researchSubField">Research Sub-Field</InputLabel>
                <Select
                labelId="form-field-researchSubField"
                name="subField"
                fullWidth
                value={workingGroupForm.values.subField}
                label="Research Sub-Field"
                onChange={workingGroupForm.handleChange}
                error={workingGroupForm.touched.subField && Boolean(workingGroupForm.errors.subField)}
                >
                    {researchSubFieldData.map(item => {
                        return (
                            <MenuItem value={item.id}>{item.label}</MenuItem>
                        )
                    })}
                </Select>

            </Grid>
            <Grid item xs={12}>
                <Button type="submit" color="primary" size="large" variant="contained">
                    create working group <AddIcon />
                </Button>
            </Grid>
        </Grid>
        </form>
    )


}