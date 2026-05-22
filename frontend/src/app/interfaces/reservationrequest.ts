export interface ReservationRequest{
  id: number,
  username: string,
  parkingLotId: number,
  reason: string,
  startDate: Date,
  endDate: Date,
  dateOfRequest: Date,
  status: string
}
