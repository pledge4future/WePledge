import { ITransportationMode } from "../interfaces/ITransportationMode";

enum Options {
    OPTION1 = "option1", 
    OPTION2 = "option2", 
    OPTION3 = "option3"
}



function getOptionName(transportationMode: any){
    console.log(transportationMode)
    return `${transportationMode.size} ${transportationMode.transportationMode}, ${transportationMode.fuelType}`
}


export function mapEstimationResultToChartData(rawData: any, options: any){
    
    const data = (Object.keys(Options) as Array<keyof typeof Options>).map((key) => {
        const co2e = rawData[Options[key]].co2e
        const name = Options[key]
        const type = options[Options[key]].transportationMode
        const label = getOptionName(options[Options[key]])
        return {
            name,
            co2e,
            type,
            label,
            max: 1000
        }
    })
    return data;
}