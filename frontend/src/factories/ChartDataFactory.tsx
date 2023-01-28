import { format, getMonth } from "date-fns"
import { IChartDataEntry } from "../interfaces/ChartData"
import { IBusinessTripEntry, ICommutingEntry, IElectricityEntry, IHeatingEntry } from "../interfaces/EmissionEntries"

enum backendResultFields {
    BUSINESSTRIP = "businesstripAggregated",
    COMMUTING = "commutingAggregated",
    ELECTRICITY = "electricityAggregated",
    HEATING = "heatingAggregated"
}

const stableEmptyDataEntry = {
    co2e: 0,
    co2eCap: 0,
    date: undefined
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


export function mapChartData(rawData: any){
    if(Object.keys(rawData).map(key => rawData[key]).every(dataEntry => dataEntry.length === 0)){
        return [];
    }
    else {
        const mappedData = {
            "businessTotal" : mapBackendResult(rawData[backendResultFields.BUSINESSTRIP]),
            "commutingTotal" : mapBackendResult(rawData[backendResultFields.COMMUTING]),
            "electricityTotal": mapBackendResult(rawData[backendResultFields.ELECTRICITY]),
            "heatingTotal": mapBackendResult(rawData[backendResultFields.HEATING])
        }
        const chartData = months.map(month => {
            return createDataEntry(month, mappedData)
        })
        return chartData;
    }
}

function createDataEntry(month: string, rawData: any): IChartDataEntry{
    const businessTripEntry = rawData.businessTotal?.find((businessTripEntry: IBusinessTripEntry) => businessTripEntry.date === month) ?? stableEmptyDataEntry
    const commutingEntry = rawData.commutingTotal?.find((commutingEntry: ICommutingEntry) => commutingEntry.date === month) ?? stableEmptyDataEntry
    const electricityEntry = rawData.electricityTotal?.find((electricityEntry: IElectricityEntry) => electricityEntry.date === month)  ?? stableEmptyDataEntry
    const heatingEntry = rawData.heatingTotal.find((heatingEntry: IHeatingEntry) => heatingEntry.date === month) ?? stableEmptyDataEntry;

    const sum = (businessTripEntry.emission + heatingEntry.emission + commutingEntry.emission + electricityEntry.emission)

    return {
        name: month, 
        business: businessTripEntry.emission,
        heating: heatingEntry.emission,
        commuting: commutingEntry.emission,
        electricity: electricityEntry.emission,
        sum: sum,
        max: 1000,
        totalMax: 1000*1,
        avg: Math.round((sum / 1) * 10) / 10
    }
}

function mapBackendResult(rawBackendResult: any){
    if ( rawBackendResult && rawBackendResult.length > 1) {
        return rawBackendResult?.map((backendResultEntry: any) => {
            const datestring = backendResultEntry.date
            const month = format(new Date(datestring), 'LLLL');
            return {
                emission: backendResultEntry.co2e,
                perCapita: backendResultEntry.co2eCap, 
                date: month
            }
        })
    }
    else {
        return []
    }
}