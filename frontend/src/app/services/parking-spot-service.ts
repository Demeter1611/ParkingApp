import { inject, Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication-service";

@Injectable({
  providedIn: 'root'
})
export class ParkingSpotService {
  url='http://localhost:4001/parking-spot';
  authenticationService = inject(AuthenticationService);

  async submitAddBulkRequest(data: any){
    /*
        request body format:{
            parkingSpotGenerator: {
                pattern: @string

                where pattern can be:
                A$ - A is kept as a prefix and $ turns into the numbers from startRange to endRange
                $A - A is kept as a suffix and $ turns into the numbers from startRange to endRange

                startRange: @int
                endRange: @int
                padding: @int

            }
            parkingLotId: @int
        }
    */
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/bulk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
          },
          body: JSON.stringify(data)
        });
        return await response.json();
      }
    } catch(err) {
      console.error(err);
    }
  }

  async submitDeleteRequest(parkingSpotId: number) {
    try{
      const authToken = this.authenticationService.token;
      if(authToken) {
        const response = await fetch(`${this.url}/${parkingSpotId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': authToken
          }
        });
        return await response.json();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async allocateSpot(parkingSpotId: number, userId: number){
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/${parkingSpotId}/allocate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
          },
          body: JSON.stringify({userId})
        });
        return await response.json();
      }
    } catch(err) {
      console.error(err);
    }
  }

  async deallocateSpot(parkingSpotId: number, userId: number){
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/${parkingSpotId}/deallocate`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
          },
          body: JSON.stringify(userId)
        });
        return await response.json();
      }
    } catch(err) {
      console.error(err);
    }
  }

  async releaseSpot(parkingSpotId: number, data: { startDate: Date, endDate: Date }){
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/${parkingSpotId}/release`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
          },
          body: JSON.stringify(data)
        });
        return await response.json();
      }
    } catch(err) {
      console.error(err);
    }
  }

  async reclaimSpot(parkingSpotId: number, data: { startDate: Date, endDate: Date}) {
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/${parkingSpotId}/reclaim`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
          },
          body: JSON.stringify(data)
        });
        return await response.json();
      }
    } catch(err){
      console.error(err);
    }
  }

  async getMine(targetDate: Date){
    const dateStr = targetDate.toISOString().split('T')[0];
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/mine?targetDate=${dateStr}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
          }
        });
        return await response.json();
      }
    } catch(err) {
      console.error(err);
    }
  }

  async getMonthData(startOfMonth: Date, endOfMonth: Date){
    const startOfMonthStr = startOfMonth.toISOString().split('T')[0];
    const endOfMonthStr = endOfMonth.toISOString().split('T')[0];
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/month-data?startOfMonth=${startOfMonthStr}&endOfMonth=${endOfMonthStr}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
          }
        });
        return await response.json();
      }
    } catch (err){
      console.error(err);
    }
  }
}
