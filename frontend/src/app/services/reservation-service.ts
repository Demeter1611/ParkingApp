import { inject, Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication-service";

@Injectable({
  providedIn: 'root'
})
export class ParkingLotService {
  url='http://localhost:4001/reservation'
  authenticationService = inject(AuthenticationService);

  async createReservation(data: {spotId: number, userId: number, startDate: Date, endDate: Date}){
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/`, {
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

  async deleteReservation(reservationId: number){
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/${reservationId}`, {
          method: 'DELETE',
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
