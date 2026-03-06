import { inject, Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication-service";

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  url='http://localhost:4001/invitation-token'
  authenticationService = inject(AuthenticationService);

  async sendInvite(data: { parkingLotId: number, email: string }){
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
    } catch(err) {
      console.error(err);
    }
  }

  async validateInvite(token: string){
    try{
      const response = await fetch(`${this.url}/validate/${token}`, {
        method: 'GET'
      });
      return await response.json();
    } catch(err){
      console.error(err);
    }
  }

  async getPendingInvites(parkingLotId: number){
    try{
      const response = await fetch(`${this.url}/${parkingLotId}/pending`, {
        method: 'GET'
      });
      return await response.json();
    } catch(err) {
      console.error(err);
    }
  }

  async cancelInvite(invitationId: number){
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/${invitationId}`, {
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
