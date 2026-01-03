import { inject, Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication-service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url='http://localhost:4001/user'
  authenticationService = inject(AuthenticationService);

  async getSearchSuggestions(searchTerm: any, parkingLotId: number){
    try{
      const authToken = this.authenticationService.token;
      if(authToken){
        const response = await fetch(`${this.url}/search-suggestions?searchTerm=${searchTerm}&parkingLotId=${parkingLotId}`, {
          method: 'GET',
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
