export interface ParkingLot{
  id: number,
  name: string,
  address: string,
  maxCapacity: number,
  timeslotsEnabled: boolean,
  sharingEnabled: boolean,
  temporaryOnlyEnabled: boolean,
  visitorSpotsEnabled: boolean,
  simplifiedGridEnabled: boolean,
  userId: number
}
