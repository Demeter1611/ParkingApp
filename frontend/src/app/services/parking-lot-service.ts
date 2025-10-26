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
}
