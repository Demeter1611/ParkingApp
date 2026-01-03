export interface ParkingSpot{
  id: number,
  name: string,
  occupantId: number,
  occupantUsername: string,
  occupantCarplate: string;
  ownerId: number,
  ownerUsername: string,
  ownerCarplate: string,
  status: string,
  windowId: number
}
