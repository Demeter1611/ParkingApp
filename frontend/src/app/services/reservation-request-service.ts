import { inject, Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication-service";

@Injectable({
  providedIn: 'root'
})
export class ReservationRequestService {
  url = 'http://localhost:4001/reservation-request';
  authenticationService = inject(AuthenticationService);

  async createRequest(data: any){
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json',
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

  async fulfillRequest(reservationRequestId: number, data: any){
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/${reservationRequestId}/fulfill`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
          },
          body: JSON.stringify(data)
        });
        return await response.json();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async getPendingRequests(parkingLotId: number){
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/?parkingLotId=${parkingLotId}&status=pending`, {
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
}

