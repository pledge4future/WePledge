enum Options {
    OPTION1 = "option1", 
    OPTION2 = "option2", 
    OPTION3 = "option3"
}

enum OptionNames {
    OPTION1 = "Transportation Option 1",
    OPTION2 = "Transportation Option 2",
    OPTION3 = "Transportation Option 3"
}



export function mapEstimationResultToChartData(rawData: any, options: any){
    
    const data = (Object.keys(Options) as Array<keyof typeof Options>).map((key) => {
        const co2e = rawData[Options[key]].co2e
        const name = OptionNames[key]
        const type = options[Options[key]].transportationMode
        return {
            name,
            co2e,
            type,
            max: 1000
        }
    })
    return data;
}