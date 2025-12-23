import { inject, Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication-service";

@Injectable({
  providedIn: 'root'
})
export class ParkingLotService {
  url='http://localhost:4001/parking-lot';
  authenticationService = inject(AuthenticationService);

  async submitAddRequest(data: any){
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

  async submitUpdateRequest(parkingLotId: number, data: any){
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/${parkingLotId}`, {
          method: 'PATCH',
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

  async submitDeleteRequest(parkingLotId: number) {
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/${parkingLotId}`, {
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

  async getMine(){
    try{
      const authToken = this.authenticationService.token;
      const userId = this.authenticationService.user.id;
      if(authToken){
        const response = await fetch(`${this.url}/${userId}`, {
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
