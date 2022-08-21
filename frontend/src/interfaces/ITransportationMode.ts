export interface ITransportationMode {
    transportationMode: string, 
    vehicleSize? : string, 
    fuelType?: string, 
    occupancy?: string, 
    seatingClass?: string, 
    passengers?: number,
    roundTrip?: boolean,
}