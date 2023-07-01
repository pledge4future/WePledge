
import { createStyles, InputLabel, makeStyles, MenuItem, Select } from "@material-ui/core";
import { useFormik } from "formik";
import React from "react";
import { Typography } from "../../components";
import TextField from "../../components/TextField";
import { InputFieldTooltip } from "../DataForms/FormSubComponents/InputFieldTooltip";
import { tooltips } from "../DataForms/FormTooltips";


export interface ITransportationModeFormProps {
    title: String,
    setTransportationMode: (value: any) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    formContainer: {
        marginTop: 20,
    }
  })
);

const transportationModes = ['Car','Train','Plane','Bus','Ferry']
const vehicleSizes = ['Small','Medium','Large','Average']
const fuelTypes = {
  car: ['Diesel','Gasoline','CNG','Electric','hybrid','Plug_In Hybrid','Average'],
  bus: ['Diesel'],
  train: ['Diesel','Electric','Average']
}
const seatingClasses = ['average','economy class','business class','first class']
const occupancies = [20,50,80,100]

const initialTransportationModeFormValues = {
    transportationMode: '',
    size: '',
    fuelType: '',
    occupancy: '',
    seatingClass: '',
    passengers: 1
}


export const TransportationModeForm = ((props: ITransportationModeFormProps) => {

    const { title, setTransportationMode } = props;

    const classes = useStyles();

    const transportationModeForm = useFormik({
        initialValues: initialTransportationModeFormValues,
        onSubmit: () => {
            //  no need to submit the form, just satisfy linter
        }
    })

    const customOnChange = ((e: any) => {
        // if transportation mode was changed, reset all form values before changing
        if(e.target.name === "transportationMode"){
            transportationModeForm.resetForm();
        }
        transportationModeForm.handleChange(e);
        setTransportationMode(e.target);
    })

    function renderFuelTypes(mode: string){
        const lowerCaseMode = mode.toLowerCase()
        //@ts-ignore
        return fuelTypes[lowerCaseMode].map((fuelType: any) => {
             return <MenuItem value={fuelType}>{`${fuelType}`}</MenuItem>
        })
      }

    return (
        <div className={classes.formContainer}>
            <Typography variant="h4" gutterBottom marked="center" align="center">
              {title}
            </Typography>
            <form>
                <InputLabel id="selectTransportationModeLabel">Transportation Mode</InputLabel>
                <Select
                style={{margin:8}}
                fullWidth
                name="transportationMode"
                labelId="selectTransportationModeLabel"
                label="Transportation Mode"
                value={transportationModeForm.values.transportationMode}
                onChange={customOnChange}
                endAdornment = {
                    <InputFieldTooltip position={'end'} text={tooltips.transportationMode} style={{marginRight:'20px'}}/> 
                }
                >
                    {transportationModes.map((tm) => {
                        return <MenuItem value={tm}>{tm}</MenuItem>
                    })}
                </Select>
                {transportationModeForm.values.transportationMode && 
                (transportationModeForm.values.transportationMode === 'Car' || transportationModeForm.values.transportationMode  === 'Bus')
                && (
                    <React.Fragment>
                        <InputLabel id="selectSizeLabel">Vehicle Size</InputLabel>
                        <Select
                        style={{margin: 8}}
                        fullWidth
                        name="size"
                        labelId="selectSizeLabel"
                        label="Vehicle Size"
                        value={transportationModeForm.values.size}
                        onChange={customOnChange}>
                            {vehicleSizes.map((vehicleSize) => {
                                return  <MenuItem value={vehicleSize}>{`${vehicleSize}`}</MenuItem>
                            })}
                        </Select>
                    </React.Fragment>
                )}
                {transportationModeForm.values.transportationMode &&
                ['Train', 'Bus', 'Car'].includes(transportationModeForm.values.transportationMode) &&  (
                    <React.Fragment>
                        <InputLabel id="selectFuelTypeLabel">Fuel Type</InputLabel>
                        <Select
                        style={{
                            margin: 8
                        }}
                        fullWidth
                        name="fuelType"
                        label="fuel type"
                        labelId="selectFuelTypeLabel"
                        value={transportationModeForm.values.fuelType}
                        onChange={customOnChange}>
                            {renderFuelTypes(transportationModeForm.values.transportationMode)}
                        </Select>
                    </React.Fragment>
                )}
                {transportationModeForm.values.transportationMode &&
                transportationModeForm.values.transportationMode === "Bus" && (
                    <React.Fragment>
                        <InputLabel id="selectOccupancyLabel">Occupancy</InputLabel>
                        <Select
                        style={{
                            margin: 8
                        }}
                        fullWidth
                        name="occupancy"
                        labelId='selectOccupancyLabel'
                        label="Occupancy"
                        endAdornment =  { <InputFieldTooltip position={"start"} text={tooltips.occupancy} style={{marginRight: '5px'}}/>}
                        value={transportationModeForm.values.occupancy}
                        onChange={customOnChange}>
                            {occupancies.map((occ) => {
                                return <MenuItem value={occ}>{`${occ}`}</MenuItem>
                            })}
                        </Select>
                    </React.Fragment>
                )}
                {transportationModeForm.values.transportationMode && 
                transportationModeForm.values.transportationMode === "Plane" && (
                    <React.Fragment>
                        <InputLabel id="selectSeatingClassLabel">Seating Class</InputLabel>
                        <Select
                        style={{margin:8}}
                        fullWidth
                        name="seatingClass"
                        labelId='selectSeatingClassLabel'
                        label="Seating Class"
                        value={transportationModeForm.values.seatingClass}
                        onChange={customOnChange}>
                        {seatingClasses.map((seatingClass) => {
                            return  <MenuItem value={seatingClass}>{`${seatingClass}`}</MenuItem>
                        })}
                        </Select>
                    </React.Fragment>
                )}
                {transportationModeForm.values.transportationMode && 
                transportationModeForm.values.transportationMode === 'Car' && (
                    <TextField
                    fullWidth
                    style={{margin: 8}}
                    margin="normal"
                    InputLabelProps={{
                        shrink:true
                    }}
                    variant="filled"
                    id="passengers"
                    name="passengers"
                    label="Passengers"
                    type="number"
                    InputProps={{
                        endAdornment:  (
                            <InputFieldTooltip position={'end'} text={tooltips.passengers} />

                        )
                    }}
                    value={transportationModeForm.values.passengers}
                    onChange={customOnChange} />
                )}
            </form>
        </div>
    )
});