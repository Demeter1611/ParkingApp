export interface ParkingSpot{
  id: number,
  name: string,
  occupantId: number | null,
  occupantUsername: string | null,
  occupantCarplate: string | null;
  ownerId: number | null,
  ownerUsername: string | null,
  ownerCarplate: string | null,
  status: string,
  windowId: number | null
}
