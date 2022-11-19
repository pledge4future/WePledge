export interface ITransportationMode {
    transportationMode: string, 
    size? : string, 
    fuelType?: string, 
    occupancy?: string, 
    seatingClass?: string, 
    passengers?: number,
    roundTrip?: boolean,
}