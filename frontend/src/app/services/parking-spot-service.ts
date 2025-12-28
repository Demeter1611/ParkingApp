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
            'Content-Type': 'application-json',
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

  async getSpotsByLot(parkingLotId: number){
    try{
      const authToken = this.authenticationService.token;
      const userId = this.authenticationService.user.id;
      if(authToken){
        const response = await fetch(`${this.url}/${parkingLotId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
          }
        });
        return await response.json();
      }
    } catch(err){
      console.error(err);
    }
  }
}
