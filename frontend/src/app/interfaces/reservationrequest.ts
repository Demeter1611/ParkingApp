export interface ReservationRequest{
  id: number,
  username: string,
  parkingLotId: number,
  reason: string,
  requestedDate: Date,
  dateOfRequest: Date,
  status: string
}
