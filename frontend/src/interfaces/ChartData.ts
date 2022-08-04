export interface IChartDataEntry {
    name: string, 
    electricity: number,
    heating: number, 
    commuting: number, 
    business: number, 
    sum: number, 
    max?: number, 
    totalMax?: number,
    avg?: number
}